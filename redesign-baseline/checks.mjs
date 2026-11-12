// Step 14 and Step 15 checks against a running build. No dependencies.
// Usage: node redesign-baseline/checks.mjs <baseUrl>
// Reports: horizontal overflow, clipped headings, small tap targets (controls and
// standalone links; inline, list and table links fall under the WCAG 2.5.8
// spacing and inline exceptions), H1 count,
// canvas elements, computed motion over the limits, reduced-motion behaviour.
import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const pages = ["/", "/tents/", "/tents/wall/14x15/", "/hunting/packages/", "/build/", "/glamping/", "/glamping/for-business/resorts/", "/stoves/", "/gear/", "/support/faq/", "/contact/", "/gift-certificates/"];
const widths = [320, 390, 768, 1024, 1280, 1440];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 9335;
const profile = path.join(os.tmpdir(), `dt-chk-${Date.now()}`);
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
const evalJs = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;
await send("Page.enable");

const layout = (w) => `(() => {
  const vw = ${w};
  const out = { overflow: document.documentElement.scrollWidth > vw + 1, clipped: [], small: [], h1: document.querySelectorAll('h1').length, canvas: document.querySelectorAll('canvas').length };
  const inScroller = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden') return true; } return false; };
  for (const h of document.querySelectorAll('h1,h2,h3')) { const r = h.getBoundingClientRect(); if (r.width && (r.right > vw + 1 || h.scrollWidth > h.clientWidth + 1) && !inScroller(h)) out.clipped.push(h.textContent.trim().slice(0, 40)); }
  for (const el of document.querySelectorAll('a[href],button,select,input:not([type=hidden])')) {
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    if (el.closest('.sr-only,.sr-only-focusable,[hidden]') || getComputedStyle(el).position === 'absolute' && r.width <= 1) continue;
    const label = el.closest('label'); const box = label ? label.getBoundingClientRect() : r;
    if (Math.min(box.width, box.height) < 24 && !el.closest('p,li,td,th,dd,dt,h2,h3,nav[aria-label=Breadcrumb]')) out.small.push((el.textContent.trim() || el.getAttribute('aria-label') || el.tagName).slice(0, 30) + ' ' + Math.round(box.width) + 'x' + Math.round(box.height));
  }
  return out;
})()`;

const motion = `(() => {
  const ms = (v) => v.split(',').map((x) => x.trim().endsWith('ms') ? parseFloat(x) : parseFloat(x) * 1000);
  const bad = [];
  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    const anim = cs.animationName !== 'none';
    const dur = Math.max(...ms(cs.transitionDuration), ...(anim ? ms(cs.animationDuration) : [0]));
    const del = Math.max(...ms(cs.transitionDelay), ...(anim ? ms(cs.animationDelay) : [0]));
    const hero = el.className && String(el.className).includes('hero__');
    const infinite = anim && cs.animationIterationCount === 'infinite';
    if ((dur > 400 && !(hero && dur <= 600)) || del > 280 || infinite) bad.push(el.tagName + '.' + String(el.className).slice(0, 40) + ' dur=' + dur + ' delay=' + del + (infinite ? ' infinite' : ''));
  }
  return bad.slice(0, 10);
})()`;

let problems = 0;
for (const route of pages) {
  for (const w of widths) {
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: w < 768 ? 844 : 900, deviceScaleFactor: 1, mobile: w < 768 });
    const done = loaded();
    await send("Page.navigate", { url: base + route });
    await done;
    await sleep(700);
    const r = await evalJs(layout(w));
    const issues = [];
    if (r.overflow) issues.push("horizontal overflow");
    if (r.clipped.length) issues.push("clipped headings: " + r.clipped.join(" | "));
    if (r.small.length) issues.push("small targets: " + [...new Set(r.small)].slice(0, 6).join(" | "));
    if (r.h1 !== 1) issues.push("h1 count " + r.h1);
    if (r.canvas) issues.push("canvas elements " + r.canvas);
    if (w === 1440) {
      const m = await evalJs(motion);
      if (m.length) issues.push("motion over limit: " + m.join(" | "));
    }
    if (issues.length) { problems++; console.log(`${route} @${w}: ${issues.join("; ")}`); }
  }
}

// Reduced motion: nothing may animate, reveals are visible, hero is at rest.
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
const done = loaded();
await send("Page.navigate", { url: base + "/" });
await done;
await sleep(150);
const rm2 = await evalJs(`(() => { const ms = (v) => Math.max(...v.split(',').map((x) => x.trim().endsWith('ms') ? parseFloat(x) : parseFloat(x) * 1000)); let worst = 0; for (const el of document.querySelectorAll('*')) { const cs = getComputedStyle(el); worst = Math.max(worst, ms(cs.transitionDuration), cs.animationName !== 'none' ? ms(cs.animationDuration) : 0); } return { worstMs: worst, hiddenReveals: [...document.querySelectorAll('.reveal')].filter((e) => getComputedStyle(e).opacity !== '1').length, heroOpacity: getComputedStyle(document.getElementById('hero-h1')).opacity }; })()`);
console.log("reduced motion:", JSON.stringify(rm2));
console.log(problems ? `${problems} page/width combinations with issues` : "no layout or motion issues found");
ws.close();
chrome.kill();
await sleep(500);
await rm(profile, { recursive: true, force: true }).catch(() => {});
