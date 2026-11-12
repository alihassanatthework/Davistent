// Viewport-sized JPEG shots for before/after review (one screen each, not full page).
// Usage: node redesign-baseline/viewports.mjs <baseUrl> <outDir>
import { spawn } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const base = process.argv[2].replace(/\/$/, "");
const out = process.argv[3];
const shots = [
  ["home-top-1440", "/", 1440, null],
  ["home-canvas-1440", "/", 1440, "h-canvas"],
  ["home-features-1440", "/", 1440, "h-features"],
  ["home-hot-1440", "/", 1440, "h-hot"],
  ["home-glamping-1440", "/", 1440, "h-b2b"],
  ["home-denver-1440", "/", 1440, "h-denver"],
  ["home-top-390", "/", 390, null],
  ["listing-1440", "/tents/", 1440, null],
  ["listing-390", "/tents/", 390, null],
  ["product-1440", "/tents/wall/14x15/", 1440, null],
  ["builder-1440", "/build/", 1440, null],
  ["glamping-1440", "/glamping/", 1440, null],
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 9334;
const profile = path.join(os.tmpdir(), `dt-vp-${Date.now()}`);
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
let ok;
for (let i = 0; i < 50 && !ok; i++) {
  await sleep(200);
  ok = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((r) => r.ok).catch(() => false);
}
const t = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" }).then((r) => r.json());
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0;
const pend = new Map();
const evs = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id) pend.get(m.id)?.(m), pend.delete(m.id);
  else evs.forEach((f) => f(m));
});
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, (m) => res(m.result)); ws.send(JSON.stringify({ id: i, method, params })); });
const loaded = () => new Promise((r) => evs.push(function f(m) { if (m.method === "Page.loadEventFired") { evs.splice(evs.indexOf(f), 1); r(); } }));
await send("Page.enable");
await mkdir(out, { recursive: true });
for (const [name, route, w, anchor] of shots) {
  const h = w === 390 ? 844 : 900;
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  const done = loaded();
  await send("Page.navigate", { url: base + route });
  await done;
  await sleep(1200);
  if (anchor) {
    await send("Runtime.evaluate", { expression: `(()=>{const el=document.getElementById(${JSON.stringify(anchor)});const s=el.closest('section')||el;window.scrollTo(0, s.getBoundingClientRect().top+scrollY-56);})()` });
    await sleep(900);
  }
  const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 72 });
  await writeFile(path.join(out, `${name}.jpg`), Buffer.from(shot.data, "base64"));
  console.log(name);
}
ws.close();
chrome.kill();
await sleep(500);
await rm(profile, { recursive: true, force: true }).catch(() => {});
