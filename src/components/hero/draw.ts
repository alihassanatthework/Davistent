/**
 * Frame sources for the Raising Camp hero.
 *
 * The production hero is a pre-rendered image sequence (Blender or a pitched
 * time-lapse, ch. 10). Until those frames exist, `drawProcedural` paints an
 * illustrated animatic of the same eight scenes at the same scroll ranges, so
 * the scroll engine, text, hotspots, budgets and fallbacks can be built and
 * tested now. When /public/hero/manifest.json is present, `ImageSequence`
 * takes over with no other change.
 */

export const VW = 1600;
export const VH = 900;

/* ---------- maths ---------- */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type RGB = [number, number, number];
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: RGB, b: RGB, t: number): string => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(",")})`;

/* Sky keyframes: pre-dawn → grey-blue → morning → dusk → night → golden hour → day */
const sky: [number, string, string][] = [
  [0, "#10242a", "#35514b"],
  [0.22, "#4f6a76", "#a3b2b0"],
  [0.4, "#89aec3", "#ecdcbf"],
  [0.56, "#1c2541", "#5a4256"],
  [0.65, "#0b1222", "#25304a"],
  [0.72, "#c98a46", "#f2cf8f"],
  [0.82, "#d9b37a", "#f4e3bd"],
  [0.9, "#f4eee2", "#f4eee2"],
];
function skyAt(p: number): [string, string] {
  for (let i = 0; i < sky.length - 1; i++) {
    const [a, at, ab] = sky[i];
    const [b, bt, bb] = sky[i + 1];
    if (p <= b) {
      const t = easeInOut(seg(p, a, b));
      return [mix(hex(at), hex(bt), t), mix(hex(ab), hex(bb), t)];
    }
  }
  return ["#f4eee2", "#f4eee2"];
}

/* ---------- tent geometry, 3/4 view in the virtual frame ---------- */
const T = {
  FL: [620, 700],
  FR: [860, 700],
  FLt: [620, 565],
  FRt: [860, 565],
  RF: [740, 470],
  BR: [1120, 632],
  BRt: [1120, 497],
  RB: [1000, 402],
} as const;
type Pt = readonly [number, number];
const poly = (c: CanvasRenderingContext2D, pts: Pt[]) => {
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
};

/** Deterministic pseudo-random for particles. */
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export type DrawOpts = { mobile: boolean };

export function drawProcedural(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, opts: DrawOpts) {
  /* cover-fit the 16:9 virtual frame; portrait crops around the tent */
  const s = Math.max(w / VW, h / VH);
  const focusX = opts.mobile ? 860 : VW / 2;
  const ox = w / 2 - focusX * s;
  const oy = (h - VH * s) / 2;

  /* camera per scene */
  let zoom = 1;
  let cx = 870;
  let cy = 600;
  let lift = 0;
  if (p < 0.1) zoom = 1 + 0.02 * seg(p, 0, 0.1);
  else if (p < 0.24) {
    const t = easeInOut(seg(p, 0.1, 0.24));
    zoom = lerp(1.02, 2.1, t);
    cy = lerp(600, 690, t);
  } else if (p < 0.38) {
    const t = easeInOut(seg(p, 0.24, 0.38));
    zoom = lerp(2.1, 1, t);
    cy = lerp(690, 600, t);
    lift = 30 * t;
  } else if (p < 0.54) {
    lift = 30;
    cx = lerp(870, 820, easeInOut(seg(p, 0.38, 0.54)));
  } else if (p < 0.68) {
    const t = seg(p, 0.54, 0.68);
    const push = t < 0.6 ? easeInOut(t / 0.6) : 1 - easeInOut((t - 0.6) / 0.4);
    zoom = lerp(1, opts.mobile ? 1.15 : 1.7, push);
    cx = lerp(820, 742, push);
    cy = lerp(600, 650, push);
    lift = 30;
  } else if (p < 0.82) {
    const t = easeInOut(seg(p, 0.68, 0.82));
    cx = lerp(820, 900, t);
    lift = lerp(30, 10, t);
  } else {
    cx = 900;
    lift = 10;
  }

  ctx.save();
  ctx.clearRect(0, 0, w, h);
  ctx.translate(ox, oy);
  ctx.scale(s, s);

  /* sky (not zoomed) */
  const [top, bottom] = skyAt(p);
  const g = ctx.createLinearGradient(0, 0, 0, VH);
  g.addColorStop(0, top);
  g.addColorStop(0.62, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(-VW, -VH, VW * 3, VH * 3);

  /* camera transform */
  ctx.translate(cx, cy + lift);
  ctx.scale(zoom, zoom);
  ctx.translate(-cx, -cy);

  const night = seg(p, 0.52, 0.6) * (1 - seg(p, 0.66, 0.72));
  const golden = seg(p, 0.68, 0.74) * (1 - seg(p, 0.84, 0.9));
  const fadeToPage = seg(p, 0.82, 0.9);

  /* ridgelines */
  ctx.fillStyle = mix(hex("#2a3d36"), hex("#0d1418"), night);
  ctx.beginPath();
  ctx.moveTo(-200, 560);
  for (let x = -200; x <= 1800; x += 80) ctx.lineTo(x, 470 - Math.sin(x / 210) * 60 - Math.cos(x / 97) * 22);
  ctx.lineTo(1800, 600);
  ctx.lineTo(-200, 600);
  ctx.fill();
  /* first warm rim on the ridge, scene 1 */
  if (p < 0.2) {
    ctx.strokeStyle = `rgba(232,160,90,${0.5 * (1 - seg(p, 0.1, 0.2))})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  /* meadow */
  const gg = ctx.createLinearGradient(0, 540, 0, VH);
  gg.addColorStop(0, mix(hex("#4d5e3a"), hex("#1a2420"), night));
  gg.addColorStop(1, mix(hex("#3a4a2c"), hex("#121a17"), night));
  ctx.fillStyle = gg;
  ctx.fillRect(-VW, 560, VW * 3, VH);

  /* snow cover builds during scene 5, melts in the time-lapse */
  const snowCover = seg(p, 0.58, 0.66) * (1 - seg(p, 0.68, 0.72));
  if (snowCover > 0) {
    ctx.fillStyle = `rgba(236,240,244,${0.85 * snowCover})`;
    ctx.fillRect(-VW, 560, VW * 3, VH);
  }

  /* low fog, scene 1 */
  if (p < 0.16) {
    const fog = ctx.createLinearGradient(0, 520, 0, 640);
    fog.addColorStop(0, "rgba(220,228,226,0)");
    fog.addColorStop(0.5, `rgba(220,228,226,${0.35 * (1 - seg(p, 0.06, 0.16))})`);
    fog.addColorStop(1, "rgba(220,228,226,0)");
    ctx.fillStyle = fog;
    ctx.fillRect(-VW, 520, VW * 3, 140);
  }

  /* deck for glamping */
  const deck = easeOut(seg(p, 0.69, 0.75));
  if (deck > 0) {
    ctx.globalAlpha = deck;
    ctx.fillStyle = "#8a6440";
    poly(ctx, [
      [520, 712],
      [900, 712],
      [1200, 640],
      [1180, 624],
      [560, 690],
    ]);
    ctx.fill();
    ctx.strokeStyle = "#5b3f26";
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(560 + i * 45, 712);
      ctx.lineTo(600 + i * 75, 640);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  /* ---- scene 1–2: the bolt ---- */
  if (p < 0.27) {
    const unroll = easeInOut(seg(p, 0.1, 0.22));
    const lifted = easeInOut(seg(p, 0.22, 0.27));
    ctx.save();
    ctx.translate(0, -lifted * 400);
    ctx.globalAlpha = 1 - lifted;
    /* unrolled cloth toward camera */
    if (unroll > 0) {
      const len = unroll * 260;
      ctx.fillStyle = "#efe6d2";
      poly(ctx, [
        [760, 690],
        [980, 690],
        [1000 + unroll * 40, 690 + len],
        [740 - unroll * 40, 690 + len],
      ]);
      ctx.fill();
      /* weave */
      ctx.strokeStyle = "rgba(120,100,70,.22)";
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 60; i++) {
        const y = 690 + (i / 60) * len;
        ctx.beginPath();
        ctx.moveTo(760 - (i / 60) * unroll * 40, y);
        ctx.lineTo(980 + (i / 60) * unroll * 40, y);
        ctx.stroke();
      }
      for (let i = 0; i < 40; i++) {
        const x = 760 + (i / 40) * 220;
        ctx.beginPath();
        ctx.moveTo(x, 690);
        ctx.lineTo(lerp(x, 740 - unroll * 40 + (i / 40) * (260 + unroll * 80), 1), 690 + len);
        ctx.stroke();
      }
      /* droplet beads near the end */
      const drop = seg(p, 0.18, 0.22);
      if (drop > 0) {
        const dy = lerp(560, 800, easeOut(Math.min(1, drop * 1.6)));
        ctx.fillStyle = "rgba(170,200,220,.85)";
        ctx.beginPath();
        ctx.ellipse(880, dy, 9, drop > 0.62 ? 6 : 11, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.8)";
        ctx.beginPath();
        ctx.arc(877, dy - 3, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    /* the roll itself */
    const r = lerp(46, 30, unroll);
    ctx.fillStyle = "#e8dcc2";
    ctx.strokeStyle = "#b9a37a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(870, 690 - r, 120, r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(752, 690 - r, 12, r, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  /* ---- scene 3: the frame (exploded → assembled) ---- */
  const frameIn = seg(p, 0.24, 0.27);
  const assemble = easeOut(seg(p, 0.27, 0.37));
  const canvasDrop = easeOut(seg(p, 0.38, 0.45));
  if (frameIn > 0 && canvasDrop < 1) {
    const ex = (pt: Pt, dx: number, dy: number): Pt => [pt[0] + dx * (1 - assemble), pt[1] + dy * (1 - assemble)];
    const steel = mix(hex("#9aa4a8"), hex("#c9d0d2"), seg(p, 0.24, 0.38));
    ctx.globalAlpha = frameIn * (1 - canvasDrop * 0.9);
    ctx.strokeStyle = steel;
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    const lines: [Pt, Pt, number, number][] = [
      [T.FL, T.FLt, -180, 0],
      [T.FR, T.FRt, 0, 120],
      [T.BR, T.BRt, 200, 0],
      [T.FLt, T.RF, -120, -140],
      [T.RF, T.FRt, 80, -160],
      [T.RF, T.RB, 0, -220],
      [T.FRt, T.BRt, 160, -60],
      [T.RB, T.BRt, 220, -120],
    ];
    for (const [a, b, dx, dy] of lines) {
      const A = ex(a, dx, dy);
      const B = ex(b, dx, dy);
      ctx.beginPath();
      ctx.moveTo(...A);
      ctx.lineTo(...B);
      ctx.stroke();
    }
    /* angle fittings */
    ctx.fillStyle = "#d9601a";
    for (const [pt, dx, dy] of [
      [T.FLt, -140, -60],
      [T.FRt, 120, -80],
      [T.RF, 0, -200],
      [T.RB, 160, -200],
      [T.BRt, 200, -60],
    ] as [Pt, number, number][]) {
      const q = ex(pt, dx, dy);
      ctx.beginPath();
      ctx.arc(q[0], q[1], 9, 0, Math.PI * 2);
      ctx.fill();
    }
    /* rubber feet */
    ctx.fillStyle = "#1c1f1e";
    for (const pt of [T.FL, T.FR, T.BR]) ctx.fillRect(pt[0] - 8, pt[1] - 2, 16, 6);
    ctx.globalAlpha = 1;
  }

  /* ---- scene 4+: the wall tent ---- */
  if (canvasDrop > 0 && fadeToPage < 1) {
    const dropY = (1 - canvasDrop) * -260;
    const isGlamp = seg(p, 0.69, 0.74);
    const cloth = mix(hex("#efe4cc"), hex("#fbfaf6"), isGlamp);
    const shade = mix(hex("#d8c9a8"), hex("#e8e4da"), isGlamp);
    ctx.save();
    ctx.globalAlpha = canvasDrop * (1 - fadeToPage);
    ctx.translate(0, dropY);
    /* shadow */
    ctx.fillStyle = "rgba(0,0,0,.18)";
    poly(ctx, [
      [600, 704],
      [880, 704],
      [1160, 640],
      [1180, 626],
    ]);
    ctx.fill();
    /* side wall */
    ctx.fillStyle = shade;
    poly(ctx, [T.FR, T.FRt, T.BRt, T.BR]);
    ctx.fill();
    /* roof */
    ctx.fillStyle = mix(hex("#e6d8b8"), hex("#f2efe8"), isGlamp);
    poly(ctx, [T.FRt, T.RF, T.RB, T.BRt]);
    ctx.fill();
    /* front gable */
    ctx.fillStyle = cloth;
    poly(ctx, [T.FL, T.FLt, T.RF, T.FRt, T.FR]);
    ctx.fill();
    ctx.strokeStyle = "rgba(60,50,30,.45)";
    ctx.lineWidth = 2;
    for (const pts of [
      [T.FL, T.FLt, T.RF, T.FRt, T.FR],
      [T.FR, T.FRt, T.BRt, T.BR],
      [T.FRt, T.RF, T.RB, T.BRt],
    ] as Pt[][]) {
      poly(ctx, pts);
      ctx.stroke();
    }
    /* sod cloth band */
    ctx.fillStyle = "rgba(90,80,60,.25)";
    poly(ctx, [
      [860, 700],
      [860, 690],
      [1120, 622],
      [1120, 632],
    ]);
    ctx.fill();
    /* window on side wall */
    ctx.strokeStyle = "rgba(60,50,30,.5)";
    poly(ctx, [
      [950, 600],
      [1020, 582],
      [1020, 620],
      [950, 638],
    ]);
    ctx.stroke();
    /* door: closes in scene 4, opens in scene 5 */
    const open = easeOut(seg(p, 0.55, 0.6)) * (1 - seg(p, 0.66, 0.7));
    const glow = open * night;
    if (glow > 0) {
      const rg = ctx.createRadialGradient(742, 650, 4, 742, 650, 180);
      rg.addColorStop(0, `rgba(255,170,80,${0.95 * glow})`);
      rg.addColorStop(1, "rgba(255,140,40,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(560, 480, 380, 300);
    }
    ctx.fillStyle = glow > 0 ? `rgba(70,35,15,${1 - glow * 0.3})` : "rgba(60,50,30,.12)";
    poly(ctx, [
      [700, 700],
      [700, 600],
      [742, 588],
      [784, 600],
      [784, 700],
    ]);
    ctx.fill();
    if (open > 0) {
      /* tied-back flap */
      ctx.fillStyle = cloth;
      poly(ctx, [
        [700, 600],
        [742, 588],
        [742 - 60 * open, 700],
        [700, 700],
      ]);
      ctx.fill();
      /* stove inside */
      ctx.fillStyle = `rgba(28,31,30,${open})`;
      ctx.fillRect(718, 664, 40, 24);
      ctx.fillStyle = `rgba(255,120,30,${open * (0.7 + 0.15 * Math.sin(p * 400))})`;
      ctx.fillRect(724, 670, 14, 12);
    } else {
      ctx.strokeStyle = "rgba(60,50,30,.5)";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(742, 590);
      ctx.lineTo(742, 700);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    /* stove pipe through the jack, inside left as you enter */
    const pipe = seg(p, 0.5, 0.55) * (1 - seg(p, 0.69, 0.72));
    if (pipe > 0) {
      ctx.strokeStyle = `rgba(40,40,40,${pipe})`;
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(1010, 452);
      ctx.lineTo(1010, 380);
      ctx.stroke();
      ctx.lineWidth = 2;
    }
    /* guy ropes and stakes */
    ctx.strokeStyle = "rgba(60,50,30,.55)";
    ctx.lineWidth = 1.5;
    for (const [a, b] of [
      [T.FLt, [560, 720]],
      [T.FRt, [880, 740]],
      [T.BRt, [1180, 660]],
      [[990, 530], [1040, 690]],
    ] as [Pt, Pt][]) {
      ctx.beginPath();
      ctx.moveTo(...a);
      ctx.lineTo(...b);
      ctx.stroke();
    }
    /* glamping: fly, awning, screen door */
    const fly = easeOut(seg(p, 0.72, 0.78));
    if (fly > 0) {
      ctx.fillStyle = "rgba(205,190,160,.95)";
      const ov = 30;
      poly(ctx, [
        [T.FLt[0] - ov, T.FLt[1] - 30],
        [T.RF[0], T.RF[1] - 22],
        [lerp(T.RF[0], T.RB[0], fly), lerp(T.RF[1] - 22, T.RB[1] - 22, fly)],
        [lerp(T.FLt[0] - ov, T.BRt[0] + ov, fly), lerp(T.FLt[1] - 30, T.BRt[1] - 20, fly)],
      ]);
      ctx.fill();
      const aw = easeOut(seg(p, 0.75, 0.8));
      ctx.fillStyle = "rgba(225,214,190,.95)";
      poly(ctx, [
        [T.FLt[0] - ov, T.FLt[1] - 20],
        [T.FRt[0] + 10, T.FRt[1] - 20],
        [T.FRt[0] + 10 - 60 * aw, T.FRt[1] - 20 + 100 * aw],
        [T.FLt[0] - ov - 80 * aw, T.FLt[1] - 20 + 100 * aw],
      ]);
      ctx.fill();
      ctx.strokeStyle = "rgba(60,50,30,.6)";
      ctx.lineWidth = 3;
      for (const x of [T.FLt[0] - ov - 80 * aw, T.FRt[0] + 10 - 60 * aw]) {
        ctx.beginPath();
        ctx.moveTo(x, T.FLt[1] - 20 + 100 * aw);
        ctx.lineTo(x, 712);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  /* smoke, scene 5 */
  const smoke = seg(p, 0.57, 0.6) * (1 - seg(p, 0.66, 0.7));
  if (smoke > 0) {
    for (let i = 0; i < 14; i++) {
      const t = (i / 14 + p * 6) % 1;
      ctx.fillStyle = `rgba(200,200,210,${smoke * 0.25 * (1 - t)})`;
      ctx.beginPath();
      ctx.arc(1010 + Math.sin(t * 6 + i) * 18 + t * 60, 370 - t * 240, 10 + t * 30, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  /* snow, scene 5 */
  const snow = seg(p, 0.58, 0.62) * (1 - seg(p, 0.66, 0.69));
  if (snow > 0) {
    ctx.fillStyle = `rgba(255,255,255,${0.9 * snow})`;
    const count = opts.mobile ? 70 : 150;
    for (let i = 0; i < count; i++) {
      const x = rnd(i) * 1800 - 100;
      const y = (rnd(i + 99) * 900 + p * 9000 * (0.5 + rnd(i + 7))) % 900;
      ctx.beginPath();
      ctx.arc(x + Math.sin(y / 60 + i) * 6, y, 1.2 + rnd(i + 3) * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  /* golden-hour warmth */
  if (golden > 0) {
    ctx.fillStyle = `rgba(255,190,110,${0.12 * golden})`;
    ctx.fillRect(-VW, -VH, VW * 3, VH * 3);
  }
  /* settle to the page colour for scenes 7–8 (DOM takes over) */
  if (fadeToPage > 0) {
    ctx.fillStyle = `rgba(244,238,226,${fadeToPage})`;
    ctx.fillRect(-VW, -VH, VW * 3, VH * 3);
  }
  ctx.restore();
}

/* ---------- Image-sequence source for production frames ---------- */
export type Manifest = {
  /** Frame-set widths available, e.g. [828, 1280, 1600]. */
  widths: number[];
  /** Per scene: number of frames and URL pattern with {w} and {i}. */
  scenes: { id: number; frames: number; pattern: string; portraitPattern?: string }[];
};

export class ImageSequence {
  private frames: (ImageBitmap | null)[] = [];
  private urls: string[] = [];
  private sceneStarts: number[] = [];
  private requested = new Set<number>();
  onProgress?: (loaded: number, total: number) => void;

  constructor(
    manifest: Manifest,
    width: number,
    portrait: boolean,
    private allowed: (sceneId: number) => boolean,
  ) {
    const w = manifest.widths.reduce((best, cur) => (Math.abs(cur - width) < Math.abs(best - width) ? cur : best), manifest.widths[0]);
    for (const sc of manifest.scenes) {
      if (!allowed(sc.id)) continue;
      this.sceneStarts.push(this.urls.length);
      const pattern = portrait && sc.portraitPattern ? sc.portraitPattern : sc.pattern;
      for (let i = 0; i < sc.frames; i++) this.urls.push(pattern.replace("{w}", String(w)).replace("{i}", String(i).padStart(4, "0")));
    }
    this.frames = new Array(this.urls.length).fill(null);
  }

  get total() {
    return this.urls.length;
  }

  /** Scene by scene: callers request the next scene when the previous reaches 50%. */
  loadScene(index: number) {
    if (this.requested.has(index) || index >= this.sceneStarts.length) return;
    this.requested.add(index);
    const from = this.sceneStarts[index];
    const to = this.sceneStarts[index + 1] ?? this.urls.length;
    for (let i = from; i < to; i++) {
      fetch(this.urls[i])
        .then((r) => r.blob())
        .then((b) => createImageBitmap(b))
        .then((bmp) => {
          this.frames[i] = bmp;
          this.onProgress?.(this.frames.filter(Boolean).length, this.total);
        })
        .catch(() => {});
    }
  }

  /** Nearest loaded frame to the requested index. */
  nearest(i: number): ImageBitmap | null {
    for (let d = 0; d < this.frames.length; d++) {
      if (this.frames[i - d]) return this.frames[i - d];
      if (this.frames[i + d]) return this.frames[i + d];
    }
    return null;
  }

  isLoaded(i: number) {
    return Boolean(this.frames[i]);
  }
}
