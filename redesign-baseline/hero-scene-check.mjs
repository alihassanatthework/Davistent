// Measures the hero campfire scene in headless Chrome: frame rate, long frames,
// frames at several moments (to show it is moving), reduced motion and mobile.
// Usage: node redesign-baseline/hero-scene-check.mjs <baseUrl> <outDir> [--gpu]
import { spawn } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const base = process.argv[2].replace(/\/$/, "");
const out = process.argv[3];
const gpu = process.argv.includes("--gpu");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 9338;
const profile = path.join(os.tmpdir(), `dt-hero-${Date.now()}`);
const flags = ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--hide-scrollbars", ...(gpu ? [] : ["--disable-gpu"]), "about:blank"];
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", flags, { stdio: "ignore" });
let ok;
for (let i = 0; i < 50 && !ok; i++) { await sleep(200); ok = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((r) => r.ok).catch(() => false); }
const t = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" }).then((r) => r.json());
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pend = new Map(); const evs = [];
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id) pend.get(m.id)?.(m), pend.delete(m.id); else evs.forEach((f) => f(m)); });
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, (m) => res(m.result)); ws.send(JSON.stringify({ id: i, method, params })); });
const loaded = () => new Promise((r) => evs.push(function f(m) { if (m.method === "Page.loadEventFired") { evs.splice(evs.indexOf(f), 1); r(); } }));
const evalJs = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;
await send("Page.enable");
await mkdir(out, { recursive: true });

const fpsProbe = `new Promise((res) => { let n = 0, last = performance.now(); const t0 = last; const d = []; function f(t) { n++; d.push(t - last); last = t; if (t - t0 < 4000) requestAnimationFrame(f); else { d.sort((a, b) => b - a); const c = document.querySelector('section canvas'); res({ fps: Math.round(n / ((t - t0) / 1000)), worstMs: Math.round(d[0]), p95Ms: Math.round(d[Math.floor(d.length * 0.05)]), canvas: c.width + 'x' + c.height }); } } requestAnimationFrame(f); })`;

async function open(w, h, reduced) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }] });
  const d = loaded();
  await send("Page.navigate", { url: base + "/" });
  await d;
  await sleep(1500);
}
const shot = async (name) => writeFile(path.join(out, name), Buffer.from((await send("Page.captureScreenshot", { format: "jpeg", quality: 80 })).data, "base64"));

console.log(gpu ? "GPU on" : "software rendering (no GPU)");
await open(1440, 900, false);
console.log("desktop 1440x900:", JSON.stringify(await evalJs(fpsProbe)));
const sample = () => evalJs("(() => { const c = document.querySelector('section canvas'); const x = c.getContext('2d'); const d = x.getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) | 0; return h; })()");
const f1 = await sample();
await sleep(600);
const f2 = await sample();
console.log("animated: frames differ over 600 ms =", f1 !== f2);
for (const [i, ms] of [0, 700, 1400].entries()) { await sleep(ms ? 700 : 0); await shot(`desktop-t${i}.jpg`); }
await open(390, 844, false);
console.log("mobile 390x844:  ", JSON.stringify(await evalJs(fpsProbe)));
await shot("mobile.jpg");
await open(768, 900, false);
await shot("tablet.jpg");
await open(1440, 900, true);
await sleep(800);
const a = await evalJs("document.querySelector('section canvas').toDataURL('image/png').length");
await sleep(1200);
const b = await evalJs("document.querySelector('section canvas').toDataURL('image/png').length");
console.log("reduced motion: frame identical after 1.2 s =", a === b);
await shot("reduced.jpg");
ws.close(); chrome.kill(); await sleep(500);
await rm(profile, { recursive: true, force: true }).catch(() => {});
