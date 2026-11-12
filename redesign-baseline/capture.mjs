// Redesign baseline / after capture (plan Step 2 and Step 15).
// Drives headless Chrome over the DevTools protocol; no dependencies.
// Usage: node redesign-baseline/capture.mjs <baseUrl> <outDir>
import { spawn } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import os from "node:os";

const base = (process.argv[2] ?? "https://davistent.vercel.app").replace(/\/$/, "");
const out = process.argv[3] ?? "redesign-baseline/before";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333;
const pages = {
  home: "/",
  listing: "/tents/",
  product: "/tents/wall/14x15/",
  builder: "/build/",
  glamping: "/glamping/",
  content: "/support/faq/",
};
const widths = [390, 768, 1440];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = path.join(os.tmpdir(), `dt-cdp-${Date.now()}`);
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--hide-scrollbars", "--no-first-run", "about:blank"], { stdio: "ignore" });

let ver;
for (let i = 0; i < 50 && !ver; i++) {
  await sleep(200);
  ver = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((r) => r.json()).catch(() => null);
}
const target = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" }).then((r) => r.json());
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let seq = 0;
const pending = new Map();
const listeners = [];
ws.addEventListener("message", (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  } else if (m.method) listeners.forEach((l) => l(m));
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, (m) => (m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;
const loaded = () => new Promise((r) => listeners.push(function f(m) { if (m.method === "Page.loadEventFired") { listeners.splice(listeners.indexOf(f), 1); r(); } }));

await send("Page.enable");
await send("Runtime.enable");
await mkdir(out, { recursive: true });

const seo = {};
for (const [name, route] of Object.entries(pages)) {
  for (const w of widths) {
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: w === 390 ? 844 : 900, deviceScaleFactor: 1, mobile: w < 768 });
    const done = loaded();
    await send("Page.navigate", { url: base + route });
    await done;
    await sleep(1500);
    // Walk the page so on-scroll content renders, then return to the top.
    await evaluate(`(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}scrollTo(0,0);await new Promise(r=>setTimeout(r,400));})()`);
    const { contentSize } = await send("Page.getLayoutMetrics");
    const h = Math.min(Math.ceil(contentSize.height), 16000);
    const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: h, scale: 1 } });
    await writeFile(path.join(out, `${name}-${w}.png`), Buffer.from(shot.data, "base64"));
    if (w === 1440) {
      const text = await evaluate("document.querySelector('main')?.innerText ?? ''");
      await writeFile(path.join(out, `${name}.txt`), text.replace(/[ \t]+\n/g, "\n"));
      seo[route] = await evaluate(`({
        title: document.title,
        description: document.querySelector('meta[name=description]')?.content ?? null,
        canonical: document.querySelector('link[rel=canonical]')?.href ?? null,
        h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()),
        jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)),
        pageHeight: document.documentElement.scrollHeight,
        canvasCount: document.querySelectorAll('canvas').length
      })`);
    }
    console.log(`${name} @${w}: ${h}px`);
  }
}

// Cart drawer, empty state, at 390 and 1440
for (const w of [390, 1440]) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: w === 390 ? 844 : 900, deviceScaleFactor: 1, mobile: w < 768 });
  const done = loaded();
  await send("Page.navigate", { url: base + "/tents/" });
  await done;
  await sleep(1200);
  await evaluate(`[...document.querySelectorAll('header button')].find(b => /cart/i.test(b.textContent))?.click()`);
  await sleep(500);
  const shot = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(path.join(out, `cart-${w}.png`), Buffer.from(shot.data, "base64"));
}

await writeFile(path.join(out, "seo.json"), JSON.stringify(seo, null, 2));

// Routes from the sitemap
const sitemap = await fetch(base + "/sitemap.xml").then((r) => r.text()).catch(() => "");
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).sort();
await writeFile(path.join(out, "routes.txt"), routes.join("\n") + "\n");

// Product count and hash of the catalogue the front end receives (seed data)
const { products } = await import(path.resolve("src/content/catalog.ts"));
const hash = createHash("sha256").update(JSON.stringify(products)).digest("hex");
await writeFile(path.join(out, "products.json"), JSON.stringify({ count: products.length, sha256: hash }, null, 2));
console.log(`routes: ${routes.length}, products: ${products.length}, sha256: ${hash.slice(0, 12)}`);

ws.close();
chrome.kill();
await sleep(500);
await rm(profile, { recursive: true, force: true }).catch(() => {});
