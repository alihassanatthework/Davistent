// Automated WCAG 2.2 AA scan with axe-core (installed with --no-save; not a project dependency).
// Usage: node redesign-baseline/a11y.mjs <baseUrl>
import { spawn } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
const base = process.argv[2].replace(/\/$/, "");
const pages = ["/", "/tents/", "/tents/wall/14x15/", "/build/", "/glamping/", "/support/faq/", "/contact/"];
const axe = await readFile("node_modules/axe-core/axe.min.js", "utf8");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 9337;
const profile = path.join(os.tmpdir(), `dt-axe-${Date.now()}`);
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
let ok;
for (let i = 0; i < 50 && !ok; i++) { await sleep(200); ok = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((r) => r.ok).catch(() => false); }
const t = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" }).then((r) => r.json());
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pend = new Map(); const evs = [];
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id) pend.get(m.id)?.(m), pend.delete(m.id); else evs.forEach((f) => f(m)); });
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, (m) => res(m.result)); ws.send(JSON.stringify({ id: i, method, params })); });
const loaded = () => new Promise((r) => evs.push(function f(m) { if (m.method === "Page.loadEventFired") { evs.splice(evs.indexOf(f), 1); r(); } }));
await send("Page.enable");
let total = 0;
for (const w of [390, 1440]) {
  for (const route of pages) {
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    const done = loaded();
    await send("Page.navigate", { url: base + route });
    await done;
    await sleep(900);
    await send("Runtime.evaluate", { expression: axe });
    const r = await send("Runtime.evaluate", { awaitPromise: true, returnByValue: true, expression: `axe.run(document, { runOnly: ['wcag2a','wcag2aa','wcag21aa','wcag22aa'] }).then(r => r.violations.map(v => v.id + ' (' + v.impact + ', ' + v.nodes.length + '): ' + v.nodes.slice(0,3).map(n => n.target.join(' ').slice(0,70) + (n.any[0]?.data?.contrastRatio ? ' ratio ' + n.any[0].data.contrastRatio : '')).join(' | ')))` });
    const v = r.result.value ?? [];
    total += v.length;
    console.log(`${route} @${w}: ${v.length ? "\n  " + v.join("\n  ") : "no violations"}`);
  }
}
console.log(`total rule violations: ${total}`);
ws.close(); chrome.kill(); await sleep(500);
await rm(profile, { recursive: true, force: true }).catch(() => {});
