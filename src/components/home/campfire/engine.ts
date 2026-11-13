/**
 * Procedural night campsite, drawn live on a 2D canvas. No video, GIF or image
 * files: every frame is generated from code.
 *
 * Layers, back to front: sky and Milky Way, twinkling stars, shooting stars,
 * two mountain ridges, tree lines, haze, the camp (tent, logs, people, fire,
 * smoke, embers), firelight, foreground grass and trees, vignette.
 *
 * Motion never loops or resets: everything is a sum of slow sine waves with
 * unrelated frequencies plus particle systems that respawn continuously.
 *
 * Performance: static layers are pre-rendered once per resize; particles are
 * pooled and drawn from small pre-rendered sprites; the loop pauses when the
 * hero is off screen or the tab is hidden, and quality drops automatically if
 * frames run long (and freezes to a still frame as a last resort).
 */

const TAU = Math.PI * 2;
type Ctx = CanvasRenderingContext2D;
type Style = string | CanvasGradient;

export type SceneHandle = { destroy(): void };

/* ---------- small helpers ---------- */

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function mk(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

/** Soft round sprite: colour fades to transparent at the edge. */
function blob(r: number, g: number, b: number, size = 64) {
  const c = mk(size, size);
  const x = c.getContext("2d")!;
  const h = size / 2;
  const gr = x.createRadialGradient(h, h, 0, h, h, h);
  gr.addColorStop(0, `rgba(${r},${g},${b},1)`);
  gr.addColorStop(0.35, `rgba(${r},${g},${b},0.55)`);
  gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
  x.fillStyle = gr;
  x.fillRect(0, 0, size, size);
  return c;
}

/** Pine tree silhouette sprite, 100 × 220. */
function pine(left: string, right: string) {
  const c = mk(100, 220);
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 100, 0);
  g.addColorStop(0, left);
  g.addColorStop(1, right);
  x.fillStyle = g;
  x.fillRect(47, 188, 6, 32);
  for (let i = 0; i < 7; i++) {
    const top = 6 + i * 26;
    const bot = top + 52;
    const hw = 14 + i * 5.8;
    x.beginPath();
    x.moveTo(50, top);
    x.lineTo(50 + hw, bot);
    x.lineTo(50 + hw * 0.5, bot - 8);
    x.lineTo(50, bot - 2);
    x.lineTo(50 - hw * 0.5, bot - 8);
    x.lineTo(50 - hw, bot);
    x.closePath();
    x.fill();
  }
  return c;
}

/** Mountain ridge with sharp peaks, as a transparent canvas. */
function ridge(w: number, h: number, baseY: number, amp: number, seed: number, top: string, bottom: string) {
  const c = mk(w, h);
  const x = c.getContext("2d")!;
  const r = rng(seed);
  const parts = [0, 1, 2, 3, 4].map((i) => ({ f: (0.0035 + r() * 0.004) * (i + 1) * 1.6, p: r() * TAU, a: (amp * 0.5) / Math.pow(i + 1, 0.85) }));
  x.beginPath();
  x.moveTo(0, h);
  for (let px = 0; px <= w; px += 4) {
    let v = 0;
    for (const k of parts) v += k.a * (1 - Math.abs(Math.sin(px * k.f + k.p)));
    x.lineTo(px, baseY - v);
  }
  x.lineTo(w, h);
  x.closePath();
  const g = x.createLinearGradient(0, baseY - amp, 0, baseY + 6);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  x.fillStyle = g;
  x.fill();
  return c;
}

/* ---------- scene data ---------- */

type Star = { x: number; y: number; r: number; a: number; sp: number; ph: number; c: string; glint: boolean };
type Flame = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; seed: number; big: boolean };
type Ember = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; seed: number };
type Smoke = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; src: 0 | 1 };
type Person = {
  x: number;
  y: number;
  s: number;
  face: 1 | -1;
  stand: boolean;
  seat: "log" | "chair" | "none";
  hat: 0 | 1 | 2 | 3;
  mug: boolean;
  talk: number;
  ph: number[];
};

/** Camp layout in scene units, relative to the fire at (0, 0). y grows toward the viewer. */
const TENT = { x: -300, y: -30 };
const PEOPLE: Person[] = ([
  { x: -125, y: 8, s: 1, face: 1, stand: false, seat: "log", hat: 1, mug: true, talk: 1, ph: [0.4, 1.7, 2.9, 4.1] },
  { x: -58, y: 38, s: 1.05, face: 1, stand: false, seat: "chair", hat: 0, mug: false, talk: 0.7, ph: [2.2, 0.3, 5.1, 1.2] },
  { x: 105, y: 28, s: 1.03, face: -1, stand: false, seat: "chair", hat: 2, mug: true, talk: 1.2, ph: [4.4, 3.3, 0.8, 2.6] },
  { x: 152, y: -6, s: 1, face: -1, stand: true, seat: "none", hat: 3, mug: false, talk: 0.9, ph: [1.1, 5.2, 3.7, 0.5] },
  { x: 58, y: -44, s: 0.9, face: -1, stand: false, seat: "log", hat: 1, mug: false, talk: 0.8, ph: [3.3, 2.1, 1.4, 4.8] },
  { x: -22, y: -50, s: 0.88, face: 1, stand: false, seat: "log", hat: 0, mug: false, talk: 1.1, ph: [5.6, 4.2, 2.3, 3.0] },
] as Person[]).sort((a, b) => a.y - b.y);

/* ---------- engine ---------- */

export function createScene(canvas: HTMLCanvasElement): SceneHandle {
  const ctx = canvas.getContext("2d", { alpha: false })!;

  // sprites
  const flameSprites = [
    blob(255, 246, 200),
    blob(255, 206, 92),
    blob(255, 142, 32),
    blob(226, 78, 16),
    blob(150, 38, 10),
  ];
  const emberSprite = blob(255, 176, 80, 32);
  const smokeSprite = blob(112, 128, 156);
  const hazeSprite = blob(96, 122, 168, 128);
  const coalSprite = blob(255, 120, 30);
  const pineFar = pine("#0a1427", "#0e1b33");
  const pineNear = pine("#050911", "#0a1220");

  // state
  let W = 1;
  let H = 1;
  let scale = 1;
  let quality = 1;
  let u = 1;
  let hy = 0;
  let cy = 0;
  let fx = 0;
  let narrow = false;
  let time = 14;
  let px = 0;
  let pxTarget = 0;

  let bg: HTMLCanvasElement;
  let farRidge: HTMLCanvasElement;
  let nearRidge: HTMLCanvasElement;
  let vignette: HTMLCanvasElement;
  let stars: Star[] = [];
  let farTrees: { x: number; h: number; ph: number }[] = [];
  let midTrees: { x: number; y: number; h: number; ph: number }[] = [];
  let blades: { x: number; h: number; ph: number; w: number }[] = [];
  let tufts: { x: number; y: number; h: number; ph: number }[] = [];

  const rnd = rng(7);
  const flames: Flame[] = [];
  const embers: Ember[] = [];
  const smoke: Smoke[] = [];
  let shoot: { x: number; y: number; ang: number; t0: number; life: number; speed: number } | null = null;
  let nextShoot = time + 3 + rnd() * 4;

  /* ----- wind and light ----- */
  const windAt = (t: number) => 0.3 + 0.45 * Math.sin(t * 0.27) + 0.25 * Math.sin(t * 0.71 + 1.3);
  const flickerAt = (t: number) =>
    clamp(0.9 + 0.06 * Math.sin(t * 7.3) + 0.04 * Math.sin(t * 13.1 + 1.7) + 0.05 * Math.sin(t * 2.3 + 0.4) + 0.04 * Math.sin(t * 23.7) * Math.sin(t * 5.1), 0.6, 1.2);

  /* ----- particles ----- */
  function spawnFlame(p: Flame) {
    const big = rnd() < 0.12;
    p.big = big;
    p.x = (rnd() + rnd() - 1) * 15;
    p.y = -2 + rnd() * 4;
    p.life = big ? 0.9 + rnd() * 0.5 : 0.5 + rnd() * 0.5;
    p.age = 0;
    p.vy = -(big ? 80 + rnd() * 40 : 68 + rnd() * 55);
    p.vx = (rnd() - 0.5) * 12;
    p.size = big ? 20 + rnd() * 9 : 12 + rnd() * 9;
    p.seed = rnd() * TAU;
  }
  function spawnEmber(p: Ember) {
    p.x = (rnd() - 0.5) * 22;
    p.y = -22 - rnd() * 10;
    p.life = 2 + rnd() * 2.6;
    p.age = 0;
    p.vy = -(32 + rnd() * 52);
    p.vx = (rnd() - 0.5) * 26;
    p.size = 2.2 + rnd() * 2.6;
    p.seed = rnd() * TAU;
  }
  function spawnSmoke(p: Smoke) {
    const pipe = rnd() < 0.22;
    p.src = pipe ? 1 : 0;
    p.x = pipe ? TENT.x + 55 + (rnd() - 0.5) * 4 : (rnd() - 0.5) * 14;
    p.y = pipe ? TENT.y - 132 : -72;
    p.life = pipe ? 5 + rnd() * 3 : 5.5 + rnd() * 3;
    p.age = 0;
    p.vy = -(pipe ? 12 + rnd() * 8 : 16 + rnd() * 14);
    p.vx = (rnd() - 0.5) * 8;
    p.size = pipe ? 7 + rnd() * 5 : 14 + rnd() * 10;
  }

  function initParticles() {
    flames.length = embers.length = smoke.length = 0;
    for (let i = 0; i < 72; i++) {
      const p = { x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 1, size: 1, seed: 0, big: false };
      spawnFlame(p);
      p.age = rnd() * p.life;
      flames.push(p);
    }
    for (let i = 0; i < 30; i++) {
      const p = { x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 1, size: 1, seed: 0 };
      spawnEmber(p);
      embers.push(p);
    }
    for (let i = 0; i < 24; i++) {
      const p: Smoke = { x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 1, size: 1, src: 0 };
      spawnSmoke(p);
      smoke.push(p);
    }
  }

  function step(dt: number) {
    time += dt;
    const w = windAt(time);
    for (const p of flames) {
      p.age += dt;
      if (p.age >= p.life) {
        spawnFlame(p);
        continue;
      }
      const k = p.age / p.life;
      p.vx += (-p.x * 2.1 + w * 10) * dt;
      p.x += (p.vx + Math.sin(p.age * (p.big ? 7 : 11) + p.seed) * (p.big ? 26 : 18) * k) * dt;
      p.y += p.vy * dt;
    }
    for (const p of embers) {
      p.age += dt;
      if (p.age >= p.life) {
        spawnEmber(p);
        continue;
      }
      p.vx += (w * 16 - p.vx * 0.35) * dt;
      p.vy *= 1 - 0.12 * dt;
      p.x += (p.vx + Math.sin(p.age * 3 + p.seed) * 14) * dt;
      p.y += p.vy * dt;
    }
    for (const p of smoke) {
      p.age += dt;
      if (p.age >= p.life) {
        spawnSmoke(p);
        continue;
      }
      p.vx += (w * 20 - p.vx) * 0.6 * dt;
      p.x += (p.vx + Math.sin(p.age * 0.9 + p.life) * 5) * dt;
      p.y += p.vy * dt;
    }
  }

  /* ----- layout and static layers ----- */
  function layout() {
    narrow = W < 1024;
    u = narrow ? clamp(Math.min(W / 610, H / 520), 0.5, 1.05) : clamp(H / 760, 0.7, 1.45);
    hy = narrow ? H * 0.32 : H * 0.6;
    cy = hy + (narrow ? 70 : 96) * u;
    fx = (narrow ? W / 2 : W * 0.72) + 112 * u;

    const r = rng(11);
    // stars
    stars = [];
    const count = clamp(Math.round((W * hy) / 2600), 120, 340);
    for (let i = 0; i < count; i++) {
      const big = r() < 0.07;
      stars.push({
        x: r() * W,
        y: r() * hy * 0.98,
        r: big ? 1.1 + r() * 0.7 : 0.5 + r() * 0.5,
        a: 0.35 + r() * 0.65,
        sp: 0.5 + r() * 2.2,
        ph: r() * TAU,
        c: r() < 0.7 ? "#ffffff" : r() < 0.5 ? "#bcd2ff" : "#ffe3c0",
        glint: big && r() < 0.6,
      });
    }
    // trees
    farTrees = [];
    for (let x = -20; x < W + 20; x += 18 * u + r() * 20 * u) farTrees.push({ x, h: (46 + r() * 50) * u, ph: r() * TAU });
    midTrees = [];
    const nMid = Math.round(W / (95 * u));
    for (let i = 0; i < nMid; i++) midTrees.push({ x: ((i + 0.3 + r() * 0.5) / nMid) * W, y: hy + (22 + r() * 40) * u, h: (110 + r() * 60) * u, ph: r() * TAU });
    // grass
    blades = [];
    const nb = clamp(Math.round(W / 5.5), 90, 300);
    for (let i = 0; i < nb; i++) blades.push({ x: (i / nb) * W + (r() - 0.5) * 8, h: (30 + r() * 50) * u, ph: r() * TAU, w: (2 + r() * 2.4) * u });
    tufts = [];
    for (let i = 0; i < 70; i++) tufts.push({ x: (r() - 0.5) * 620, y: 10 + r() * 76, h: 10 + r() * 20, ph: r() * TAU });
  }

  function buildLayers() {
    // background: sky, Milky Way, ground
    bg = mk(W, H);
    const b = bg.getContext("2d")!;
    const sky = b.createLinearGradient(0, 0, 0, hy);
    sky.addColorStop(0, "#060c26");
    sky.addColorStop(0.45, "#0e2048");
    sky.addColorStop(0.82, "#1b3a6e");
    sky.addColorStop(1, "#2e558a");
    b.fillStyle = sky;
    b.fillRect(0, 0, W, hy + 2);
    // Milky Way: diagonal glow band with fine dust
    b.save();
    b.translate(W * 0.38, hy * 0.35);
    b.rotate(-0.5);
    const mw = b.createLinearGradient(0, -hy * 0.3, 0, hy * 0.3);
    mw.addColorStop(0, "rgba(150,170,255,0)");
    mw.addColorStop(0.5, "rgba(150,170,255,0.085)");
    mw.addColorStop(1, "rgba(150,170,255,0)");
    b.fillStyle = mw;
    b.fillRect(-W, -hy * 0.3, W * 2, hy * 0.6);
    const r = rng(23);
    for (let i = 0; i < 520; i++) {
      const gx = (r() - 0.5) * W * 1.6;
      const gy = (r() + r() - 1) * hy * 0.2;
      b.fillStyle = `rgba(200,215,255,${0.05 + r() * 0.18})`;
      b.fillRect(gx, gy, 1, 1);
    }
    b.restore();
    const ground = b.createLinearGradient(0, hy, 0, H);
    ground.addColorStop(0, "#0a1730");
    ground.addColorStop(0.35, "#070f1e");
    ground.addColorStop(1, "#03060c");
    b.fillStyle = ground;
    b.fillRect(0, hy, W, H - hy);

    const wC = Math.ceil(W * 1.08);
    const hC = Math.ceil(hy + 24);
    farRidge = ridge(wC, hC, hy + 2, hy * 0.36, 5, "#1a3560", "#0f2140");
    nearRidge = ridge(wC, hC, hy + 5, hy * 0.19, 17, "#112648", "#0a1630");

    vignette = mk(W, H);
    const v = vignette.getContext("2d")!;
    const vg = v.createRadialGradient(W / 2, H * 0.55, Math.min(W, H) * 0.35, W / 2, H * 0.55, Math.max(W, H) * 0.78);
    vg.addColorStop(0, "rgba(2,4,10,0)");
    vg.addColorStop(1, "rgba(2,4,10,0.5)");
    v.fillStyle = vg;
    v.fillRect(0, 0, W, H);
  }

  /* ----- drawing ----- */
  function drawStars(t: number) {
    for (const s of stars) {
      const tw = 0.55 + 0.45 * Math.sin(t * s.sp + s.ph);
      ctx.globalAlpha = s.a * tw;
      ctx.fillStyle = s.c;
      const d = s.r * 1.5;
      ctx.fillRect(s.x, s.y, d, d);
      if (s.glint) {
        ctx.fillRect(s.x - s.r * 2.4, s.y + d / 2 - 0.3, s.r * 6, 0.6);
        ctx.fillRect(s.x + d / 2 - 0.3, s.y - s.r * 2.4, 0.6, s.r * 6);
      }
    }
    ctx.globalAlpha = 1;
    if (!shoot && t > nextShoot) {
      shoot = { x: W * (0.12 + Math.random() * 0.6), y: hy * (0.05 + Math.random() * 0.3), ang: 0.3 + Math.random() * 0.25, t0: t, life: 0.9, speed: W * 0.65 };
    }
    if (shoot) {
      const k = (t - shoot.t0) / shoot.life;
      if (k >= 1) {
        shoot = null;
        nextShoot = t + 8 + Math.random() * 9;
      } else {
        const dx = Math.cos(shoot.ang);
        const dy = Math.sin(shoot.ang);
        const hx = shoot.x + dx * shoot.speed * k * shoot.life;
        const hyy = shoot.y + dy * shoot.speed * k * shoot.life;
        const len = 140;
        const g = ctx.createLinearGradient(hx, hyy, hx - dx * len, hyy - dy * len);
        g.addColorStop(0, "rgba(255,255,255,0.9)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = Math.sin(Math.PI * k) * 0.85;
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(hx, hyy);
        ctx.lineTo(hx - dx * len, hyy - dy * len);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  function drawTree(sprite: HTMLCanvasElement, x: number, baseY: number, h: number, sway: number) {
    const w = h * 0.45;
    ctx.setTransform(scale, 0, (-sway / h) * scale, scale, x * scale, baseY * scale);
    ctx.drawImage(sprite, -w / 2, -h, w, h);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function drawHaze(t: number, set: number) {
    const w = windAt(t);
    ctx.globalAlpha = 0.075;
    for (let i = 0; i < 3; i++) {
      const k = i + set * 3;
      const bx = ((k * 0.37 + 0.1) % 1) * W + Math.sin(t * (0.05 + k * 0.011) + k) * W * 0.09 + w * 14;
      const by = set === 0 ? hy + (8 + i * 22) * u : cy + (-20 + i * 24) * u;
      const ww = (set === 0 ? 720 : 560) * u;
      ctx.drawImage(hazeSprite, bx - ww / 2, by - ww * 0.11, ww, ww * 0.22);
    }
    ctx.globalAlpha = 1;
  }

  function limb(x1: number, y1: number, x2: number, y2: number, w: number) {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function drawPerson(p: Person, t: number, fl: number) {
    const f = p.face;
    const [a, b, c, d] = p.ph;
    const env = (o: number, k: number) => clamp(Math.pow(Math.max(0, Math.sin(t * 0.43 * k + o) * Math.sin(t * 0.29 * k + o * 1.7 + 1)), 1.4) * 1.7 * p.talk, 0, 1);
    const g1 = env(a, 1);
    const g2 = env(c, 0.8) * 0.5;
    const breathe = Math.sin(t * 1.6 + b);
    const headDx = Math.sin(t * 0.7 + a) * 1.5 + g1 * Math.sin(t * 5 + b) * 0.5;
    const headDy = Math.sin(t * 1.1 + c) * 0.7 + g1 * Math.sin(t * 4 + a) * 0.5;

    let hip: [number, number];
    let sh: [number, number];
    let head: [number, number];
    let k1: [number, number];
    let f1: [number, number];
    let k2: [number, number];
    let f2: [number, number];
    if (p.stand) {
      const shift = Math.sin(t * 0.35 + d) * 1.2;
      hip = [shift * 0.5, -84];
      sh = [shift + f * 1.5, -132 + breathe * 0.4];
      head = [sh[0] + f * 1 + headDx, sh[1] - 11 + headDy];
      k1 = [-5, -42];
      f1 = [-6 + shift, 0];
      k2 = [6, -42];
      f2 = [8 + shift, 0];
    } else {
      const lean = f * (2 + Math.sin(t * 0.3 + d) * 1.5);
      hip = [0, -20];
      sh = [lean + f * 1.5, -60 + breathe * 0.4];
      head = [sh[0] + f * 1.5 + headDx, sh[1] - 11 + headDy];
      k1 = [f * 25, -23];
      f1 = [f * 28, 0];
      k2 = [f * 22, -21];
      f2 = [f * 19, 0];
    }

    const L1 = 20;
    const L2 = 19;
    const arm = (sx: number, sy: number, a1: number, a2: number): [[number, number], [number, number]] => {
      const ex = sx + f * L1 * Math.sin(a1);
      const ey = sy + L1 * Math.cos(a1);
      return [[ex, ey], [ex + f * L2 * Math.sin(a1 + a2), ey + L2 * Math.cos(a1 + a2)]];
    };
    const near = p.stand
      ? arm(sh[0], sh[1], 0.45 + g1 * 0.4, 0.95 - g1 * 0.45 + Math.sin(t * 2.1 + a) * 0.08 * g1)
      : arm(sh[0], sh[1], 0.35 + g1 * (1 + 0.3 * Math.sin(t * 2.1 + a)), 1.15 - g1 * (0.9 - 0.4 * Math.sin(t * 2.9 + a * 1.3)));
    const far = p.stand
      ? arm(sh[0] - f * 2, sh[1], 0.08 + g2 * 0.5, 0.15 + g2 * 0.4)
      : arm(sh[0] - f * 2, sh[1], 0.22 + g2 * 0.7, 1.25 - g2 * 0.6);

    const body = (style: Style) => {
      ctx.strokeStyle = style;
      ctx.fillStyle = style;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      limb(sh[0] - f * 2, sh[1], far[0][0], far[0][1], 6);
      limb(far[0][0], far[0][1], far[1][0], far[1][1], 5.4);
      limb(hip[0], hip[1], k2[0], k2[1], 8);
      limb(k2[0], k2[1], f2[0], f2[1], 6.5);
      limb(hip[0], hip[1], k1[0], k1[1], 8.4);
      limb(k1[0], k1[1], f1[0], f1[1], 7);
      limb(hip[0], hip[1], sh[0], sh[1] + 2, 17);
      limb(sh[0], sh[1] + 2, head[0], head[1] + 8, 5.5);
      limb(sh[0], sh[1], near[0][0], near[0][1], 6.4);
      limb(near[0][0], near[0][1], near[1][0], near[1][1], 5.6);
      ctx.beginPath();
      ctx.arc(head[0], head[1], 8.6, 0, TAU);
      ctx.fill();
      if (p.hat === 1) {
        ctx.beginPath();
        ctx.ellipse(head[0], head[1] - 2, 9.8, 8.2, 0, Math.PI, TAU);
        ctx.fill();
        limb(head[0] - 9.4, head[1] - 1.5, head[0] + 9.4, head[1] - 1.5, 3);
      } else if (p.hat === 2) {
        ctx.beginPath();
        ctx.ellipse(head[0], head[1] - 3, 9.2, 6.5, 0, Math.PI, TAU);
        ctx.fill();
        limb(head[0] + f * 5, head[1] - 3.5, head[0] + f * 14, head[1] - 2, 2.6);
      } else if (p.hat === 3) {
        limb(head[0] - f * 7, head[1] - 3, head[0] - f * 12, head[1] + 6 + Math.sin(t * 1.4 + a), 3.2);
      }
      if (p.mug) ctx.fillRect(near[1][0] - 2.6, near[1][1] - 5, 5.2, 6.4);
    };

    const dist = Math.abs(p.x) + Math.abs(p.y) * 1.5;
    const light = clamp(1.15 - dist / 330, 0.28, 1) * 0.6 * fl;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(p.s, p.s);

    // cast shadow stretches away from the fire and shifts with the flicker
    const away = p.x >= 0 ? 1 : -1;
    ctx.save();
    ctx.globalAlpha = 0.34;
    ctx.fillStyle = "#02040a";
    ctx.beginPath();
    ctx.ellipse(away * (44 + (fl - 0.9) * 40), 2, 56 * (1 + (fl - 0.9) * 0.7), 7, Math.sin(t * 0.9 + a) * 0.03, 0, TAU);
    ctx.fill();
    ctx.restore();

    // seat
    if (p.seat === "log") {
      ctx.fillStyle = "#150f0c";
      ctx.beginPath();
      ctx.ellipse(0, -9, 38, 10, 0, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = `rgba(255,140,60,${0.35 * light})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, -10, 37, 9, 0, Math.PI * (f > 0 ? 1.15 : 1.85), Math.PI * (f > 0 ? 1.85 : 2.55));
      ctx.stroke();
    } else if (p.seat === "chair") {
      ctx.strokeStyle = "#070b14";
      ctx.lineCap = "round";
      limb(-f * 15, -20, -f * 17, -50, 3);
      limb(-f * 15, -20, f * 14, -20, 4);
      limb(-f * 15, -20, -f * 18, 0, 2.4);
      limb(f * 14, -20, f * 17, 0, 2.4);
    }

    body("#070b16");
    // firelight on the side facing the fire
    const warm = ctx.createLinearGradient(f * 15, 0, -f * 15, 0);
    warm.addColorStop(0, `rgba(255,152,64,${light})`);
    warm.addColorStop(0.3, `rgba(255,112,40,${light * 0.22})`);
    warm.addColorStop(0.6, "rgba(255,90,30,0)");
    warm.addColorStop(1, "rgba(255,90,30,0)");
    body(warm);
    ctx.restore();
  }

  function drawTent(t: number, fl: number) {
    const w = windAt(t);
    const sway = Math.sin(t * 0.9) * 0.8 + Math.sin(t * 1.7 + 1) * 0.4 + w * 1.2;
    const lantern = clamp(0.82 + 0.1 * Math.sin(t * 3.3) + 0.06 * Math.sin(t * 8.1 + 2) + (fl - 0.9) * 0.4, 0.55, 1.05);
    ctx.save();
    ctx.translate(TENT.x, TENT.y);

    // guy ropes and stakes
    ctx.strokeStyle = "rgba(150,170,210,0.22)";
    ctx.lineWidth = 0.8;
    for (const s of [-1, 1]) {
      limb(s * 92, -74, s * 152, 0, 0.8);
      ctx.fillStyle = "#070b14";
      ctx.fillRect(s * 152 - 1, -3, 2.4, 6);
    }

    const walls = () => {
      ctx.beginPath();
      ctx.moveTo(-92, 0);
      ctx.quadraticCurveTo(-93 + sway * 0.5, -37, -92, -74);
      ctx.lineTo(sway * 0.6, -128);
      ctx.lineTo(92, -74);
      ctx.quadraticCurveTo(93 + sway * 0.5, -37, 92, 0);
      ctx.closePath();
    };
    const base = ctx.createLinearGradient(-92, 0, 92, 0);
    base.addColorStop(0, "#0b1428");
    base.addColorStop(0.55, "#111e3a");
    base.addColorStop(1, "#18284a");
    walls();
    ctx.fillStyle = base;
    ctx.fill();
    // firelight on the right side
    const warm = ctx.createLinearGradient(-30, 0, 92, 0);
    warm.addColorStop(0, "rgba(255,130,50,0)");
    warm.addColorStop(1, `rgba(255,130,50,${0.3 * fl})`);
    walls();
    ctx.fillStyle = warm;
    ctx.fill();
    // moonlit ridge and seams
    ctx.strokeStyle = "rgba(130,160,220,0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-92, -74);
    ctx.lineTo(sway * 0.6, -128);
    ctx.lineTo(92, -74);
    ctx.stroke();
    ctx.strokeStyle = "rgba(5,10,22,0.5)";
    ctx.lineWidth = 0.8;
    for (const sx of [-60, -30, 30, 60]) {
      ctx.beginPath();
      ctx.moveTo(sx, -2);
      ctx.lineTo(sx * 0.9 + sway * 0.2, -88 + Math.abs(sx) * 0.4);
      ctx.stroke();
    }
    // glowing doorway
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-20, -42);
    ctx.quadraticCurveTo(0, -62 + sway * 0.3, 20, -42);
    ctx.lineTo(20, 0);
    ctx.closePath();
    const door = ctx.createRadialGradient(0, -22, 2, 0, -22, 44);
    door.addColorStop(0, `rgba(255,214,150,${0.95 * lantern})`);
    door.addColorStop(0.5, `rgba(255,150,70,${0.8 * lantern})`);
    door.addColorStop(1, `rgba(110,48,18,${0.9 * lantern})`);
    ctx.fillStyle = door;
    ctx.fill();
    // stove pipe
    ctx.strokeStyle = "#04070d";
    ctx.lineWidth = 4;
    limb(55, -96, 55, -132, 4);
    ctx.restore();
  }

  function drawFire(fl: number) {
    // coals and crossed logs
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.55 * fl;
    ctx.drawImage(coalSprite, -42, -12, 84, 26);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "#1c120c";
    ctx.lineCap = "round";
    limb(-27, 3, 15, -9, 7);
    limb(-15, -6, 27, 3, 7);
    limb(-7, 5, 9, -10, 6);
    ctx.strokeStyle = `rgba(255,120,40,${0.5 * fl})`;
    limb(-27, 1.5, 14, -10.5, 1.6);
    limb(-15, -7.5, 27, 1.5, 1.6);
    // flames: stacked, additive sprites that fade through the colour ramp
    ctx.globalCompositeOperation = "lighter";
    for (const p of flames) {
      const k = p.age / p.life;
      const size = p.size * (1 - k * 0.86);
      const stage = clamp(k * 4.2, 0, 3.999);
      const i = Math.floor(stage);
      const fr = stage - i;
      const a = (1 - k * 0.55) * (p.big ? 0.62 : 0.85);
      const wd = size * 2.3;
      const ht = size * 3.4;
      ctx.globalAlpha = a * (1 - fr);
      ctx.drawImage(flameSprites[i], p.x - wd / 2, p.y - ht / 2, wd, ht);
      ctx.globalAlpha = a * fr;
      ctx.drawImage(flameSprites[i + 1], p.x - wd / 2, p.y - ht / 2, wd, ht);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function drawSmoke() {
    for (const p of smoke) {
      const k = p.age / p.life;
      const size = p.size + k * (p.src ? 36 : 62);
      ctx.globalAlpha = Math.sin(Math.PI * k) * (p.src ? 0.09 : 0.17);
      ctx.drawImage(smokeSprite, p.x - size / 2, p.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  }

  function drawEmbers() {
    ctx.globalCompositeOperation = "lighter";
    for (const p of embers) {
      const k = p.age / p.life;
      const tw = 0.6 + 0.4 * Math.sin(p.age * 20 + p.seed);
      const s = p.size * (1 - k * 0.5) * 1.6;
      ctx.globalAlpha = (1 - k) * tw;
      ctx.drawImage(emberSprite, p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function drawFirelight(fl: number) {
    ctx.globalCompositeOperation = "lighter";
    // pool of light on the ground
    ctx.save();
    ctx.translate(0, 8);
    ctx.scale(1, 0.3);
    const pool = ctx.createRadialGradient(0, 0, 0, 0, 0, 300);
    pool.addColorStop(0, `rgba(255,140,55,${0.34 * fl})`);
    pool.addColorStop(0.5, `rgba(255,100,30,${0.1 * fl})`);
    pool.addColorStop(1, "rgba(255,90,30,0)");
    ctx.fillStyle = pool;
    ctx.fillRect(-300, -300, 600, 600);
    ctx.restore();
    // warm wash over everything near the fire
    const wash = ctx.createRadialGradient(0, -30, 0, 0, -30, 380);
    wash.addColorStop(0, `rgba(255,140,50,${0.26 * fl})`);
    wash.addColorStop(0.45, `rgba(255,100,30,${0.09 * fl})`);
    wash.addColorStop(1, "rgba(255,90,30,0)");
    ctx.fillStyle = wash;
    ctx.fillRect(-520, -430, 1040, 700);
    ctx.globalCompositeOperation = "source-over";
  }

  function drawTufts(t: number, fl: number) {
    const w = windAt(t);
    const path = new Path2D();
    for (const g of tufts) {
      const sw = (Math.sin(t * 1.3 + g.ph) * 0.5 + w * 0.6) * g.h * 0.28;
      path.moveTo(g.x - 1.6, g.y);
      path.quadraticCurveTo(g.x + sw * 0.4, g.y - g.h * 0.6, g.x + sw, g.y - g.h);
      path.quadraticCurveTo(g.x + sw * 0.5 + 1.2, g.y - g.h * 0.5, g.x + 1.6, g.y);
    }
    ctx.fillStyle = "#050a14";
    ctx.fill(path);
    ctx.globalCompositeOperation = "lighter";
    const lit = ctx.createRadialGradient(0, 0, 0, 0, 0, 260);
    lit.addColorStop(0, `rgba(255,130,45,${0.16 * fl})`);
    lit.addColorStop(1, "rgba(255,110,40,0)");
    ctx.fillStyle = lit;
    ctx.fill(path);
    ctx.globalCompositeOperation = "source-over";
  }

  function drawForeground(t: number) {
    const w = windAt(t);
    // big dark trees at the edges
    const th = H * (narrow ? 0.8 : 1);
    drawTree(pineNear, W * (narrow ? -0.05 : -0.02) - px * W * 0.02, H + 12, th, 0.02 * (0.4 + w * 0.5) * th + Math.sin(t * 0.6) * 1.5);
    drawTree(pineNear, W * (narrow ? 1.05 : 1.02) - px * W * 0.02, H + 12, th * 0.9, 0.02 * (0.4 + w * 0.5) * th * 0.9 + Math.sin(t * 0.55 + 2) * 1.5);
    // grass along the bottom edge
    const path = new Path2D();
    const off = -px * W * 0.02;
    for (const g of blades) {
      const sw = (Math.sin(t * 1.2 + g.ph) * 0.45 + w * 0.7) * g.h * 0.3;
      const bx = g.x + off;
      path.moveTo(bx - g.w, H + 2);
      path.quadraticCurveTo(bx + sw * 0.35, H - g.h * 0.6, bx + sw, H - g.h);
      path.quadraticCurveTo(bx + sw * 0.5 + g.w * 0.6, H - g.h * 0.5, bx + g.w, H + 2);
    }
    ctx.fillStyle = "#03060c";
    ctx.fill(path);
  }

  function draw() {
    const t = time;
    const fl = flickerAt(t);
    const pe = px + Math.sin(t * 0.045) * 0.35;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    ctx.drawImage(bg, 0, 0, W, H);
    drawStars(t);
    ctx.drawImage(farRidge, -W * 0.04 - pe * W * 0.006, 0, W * 1.08, farRidge.height);
    ctx.drawImage(nearRidge, -W * 0.04 - pe * W * 0.012, 0, W * 1.08, nearRidge.height);

    const wnd = windAt(t);
    for (const tr of farTrees) drawTree(pineFar, tr.x - pe * W * 0.012, hy + 8 * u, tr.h, 0.018 * tr.h * (0.4 + wnd * 0.5) + Math.sin(t * 0.7 + tr.ph) * 0.6);
    drawHaze(t, 0);
    for (const tr of midTrees) drawTree(pineNear, tr.x - pe * W * 0.008, tr.y, tr.h, 0.02 * tr.h * (0.4 + wnd * 0.5) + Math.sin(t * 0.65 + tr.ph) * 1);

    // camp, in scene units around the fire
    ctx.save();
    ctx.translate(fx - pe * W * 0.003, cy);
    ctx.scale(u, u);
    drawTent(t, fl);
    let fireDrawn = false;
    for (const p of PEOPLE) {
      if (!fireDrawn && p.y > 0) {
        drawFire(fl);
        fireDrawn = true;
      }
      drawPerson(p, t, fl);
    }
    if (!fireDrawn) drawFire(fl);
    drawSmoke();
    drawEmbers();
    drawTufts(t, fl);
    drawFirelight(fl);
    ctx.restore();

    drawHaze(t, 1);
    drawForeground(t);
    ctx.drawImage(vignette, 0, 0, W, H);
  }

  /* ----- sizing, lifecycle, fallbacks ----- */
  function resize() {
    // layout size: unaffected by the hero entrance transform, unlike getBoundingClientRect
    W = Math.max(1, canvas.clientWidth);
    H = Math.max(1, canvas.clientHeight);
    const s = Math.min(window.devicePixelRatio || 1, W < 768 ? 1.25 : 1.5) * quality;
    canvas.width = Math.round(W * s);
    canvas.height = Math.round(H * s);
    scale = canvas.width / W;
    layout();
    buildLayers();
    if (!running) draw();
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  const weak = !!nav.connection?.saveData || (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) || (!!nav.hardwareConcurrency && nav.hardwareConcurrency <= 2);
  let animated = !reduce.matches && !weak;
  let visible = true;
  let running = false;
  let raf = 0;
  let last = 0;
  let ema = 16;
  let frames = 0;

  function frame(now: number) {
    raf = 0;
    if (!running) return;
    const dtRaw = (now - last) / 1000;
    last = now;
    const dt = clamp(dtRaw, 0, 0.05);
    ema = ema * 0.94 + dtRaw * 1000 * 0.06;
    px += (pxTarget - px) * 0.04;
    step(dt);
    draw();
    if (++frames % 90 === 0) {
      if (ema > 24 && quality > 0.6) {
        quality = Math.max(0.55, quality - 0.15);
        resize();
        ema = 16;
      } else if (ema > 45 && quality <= 0.6) {
        animated = false;
        sync();
        return;
      }
    }
    raf = requestAnimationFrame(frame);
  }
  function sync() {
    const should = animated && visible && !document.hidden;
    if (should && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else if (!should && running) {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
      draw();
    }
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "mouse") pxTarget = (e.clientX / window.innerWidth - 0.5) * 2;
  };
  const onVis = () => sync();
  const onReduce = () => {
    animated = !reduce.matches && !weak;
    sync();
  };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    sync();
  });
  let pending = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(resize);
  });

  initParticles();
  for (let i = 0; i < 300; i++) step(1 / 30); // warm-up so the first frame already has full flames and smoke
  time = 14;
  resize();
  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("visibilitychange", onVis);
  reduce.addEventListener("change", onReduce);
  io.observe(canvas);
  ro.observe(canvas);
  sync();

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pending);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      reduce.removeEventListener("change", onReduce);
      io.disconnect();
      ro.disconnect();
    },
  };
}

