"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { drawProcedural, ImageSequence, VH, VW, type Manifest } from "./draw";
import { heroHotspots, packItems, scenes, type Scene } from "./scenes";
import { TentIllustration } from "../TentIllustration";
import type { Illustration } from "@/content/catalog";

type Mode = "pending" | "motion" | "stills" | "collapsed";

const SEEN = "dt-hero-seen";
const stillArt: Record<number, Illustration> = { 1: "bag", 2: "bag", 3: "frame", 4: "wall", 5: "package", 6: "glamp", 7: "gear" };

/**
 * Raising Camp (ch. 10–12).
 *
 * - The wrapper is pinned with position: sticky inside a tall container (700 vh
 *   desktop, 400 vh mobile); GSAP ScrollTrigger only reads progress, so scroll
 *   is never hijacked. Scrub smoothing 0.3 s, no snapping.
 * - One canvas at device pixel ratio capped at 2; drawn inside rAF only when
 *   progress changes.
 * - H1 and buttons are real DOM, first in tab order after "Skip intro".
 * - prefers-reduced-motion, Save-Data and slow connections get five stacked
 *   stills with the same text; the visitor can choose "Play the full intro".
 * - Three consecutive draws over 32 ms switch to stills for the session.
 * - Returning visitors in the same session see the hero collapsed with Replay.
 */
export function RaisingCamp({ manifest }: { manifest: Manifest | null }) {
  const [mode, setMode] = useState<Mode>("pending");
  const [mobile, setMobile] = useState(false);
  const [lagging, setLagging] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const hotspotLayer = useRef<HTMLDivElement>(null);
  const packLayer = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  /* choose the mode once, at load */
  useEffect(() => {
    const isMobile = matchMedia("(max-width: 767px)").matches;
    setMobile(isMobile);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = conn?.saveData || ["slow-2g", "2g"].includes(conn?.effectiveType ?? "");
    let seen = false;
    let lowPower = false;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
      lowPower = sessionStorage.getItem("dt-hero-lowpower") === "1";
    } catch {}
    const supported = typeof CanvasRenderingContext2D !== "undefined" && "IntersectionObserver" in window;
    if (!supported || reduced || slow || lowPower) setMode("stills");
    else if (seen) setMode("collapsed");
    else setMode("motion");
  }, []);

  const play = useCallback(() => {
    try {
      sessionStorage.removeItem(SEEN);
      sessionStorage.removeItem("dt-hero-lowpower");
    } catch {}
    setMode("motion");
    requestAnimationFrame(() => wrap.current?.scrollIntoView({ block: "start" }));
  }, []);

  /* the motion engine */
  useEffect(() => {
    if (mode !== "motion") return;
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return setMode("stills");

    let disposed = false;
    let raf = 0;
    let lastDrawn = -1;
    let slowDraws = 0;
    let visible = true;
    let seq: ImageSequence | null = null;
    const activeScenes = scenes.filter((s) => !mobile || s.mobile);

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      lastDrawn = -1;
    };
    size();

    if (manifest) {
      seq = new ImageSequence(manifest, cv.clientWidth * Math.min(2, devicePixelRatio), mobile, (id) => activeScenes.some((s) => s.id === id));
      seq.loadScene(0);
    }

    const toFrame = (p: number) => (seq ? Math.min(seq.total - 1, Math.floor(p * seq.total)) : p);

    const draw = () => {
      raf = 0;
      if (disposed || !visible) return;
      const p = progressRef.current;
      const key = seq ? toFrame(p) : Math.round(p * 2000);
      if (key === lastDrawn) return;
      lastDrawn = key;
      const t0 = performance.now();
      if (seq) {
        const i = toFrame(p);
        const bmp = seq.nearest(i);
        setLagging(!seq.isLoaded(i));
        if (bmp) {
          const s = Math.max(cv.width / bmp.width, cv.height / bmp.height);
          ctx.drawImage(bmp, (cv.width - bmp.width * s) / 2, (cv.height - bmp.height * s) / 2, bmp.width * s, bmp.height * s);
        }
        /* load the next scene when the current one reaches 50% */
        const idx = activeScenes.findIndex((sc) => p >= sc.start && p < sc.end);
        if (idx >= 0 && (p - activeScenes[idx].start) / (activeScenes[idx].end - activeScenes[idx].start) > 0.5) seq.loadScene(idx + 1);
      } else {
        drawProcedural(ctx, cv.width, cv.height, p, { mobile });
      }
      const dt = performance.now() - t0;
      slowDraws = dt > 32 ? slowDraws + 1 : 0;
      if (slowDraws >= 3) {
        try {
          sessionStorage.setItem("dt-hero-lowpower", "1");
        } catch {}
        setMode("stills");
      }
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    /* DOM layers: text, hotspots and the pack-in scene */
    const updateDom = (p: number) => {
      activeScenes.forEach((sc) => {
        const node = layers.current[sc.id];
        if (!node) return;
        const fadeIn = sc.id === 1 ? 1 : clamp01((p - sc.start) / 0.025);
        const fadeOut = sc.id === 1 ? 1 - clamp01((p - 0.07) / 0.03) : sc.id === 8 ? 1 : 1 - clamp01((p - (sc.end - 0.025)) / 0.025);
        const o = Math.min(fadeIn, fadeOut);
        node.style.opacity = String(o);
        node.style.transform = `translateY(${(1 - fadeIn) * 16}px)`;
        node.style.visibility = o < 0.02 ? "hidden" : "visible";
        node.querySelectorAll<HTMLElement>("[data-line]").forEach((li, n) => {
          const at = sc.id === 2 ? [0.13, 0.16, 0.19][n] ?? sc.start : sc.start + 0.02 + n * 0.01;
          const on = p >= at;
          li.style.opacity = on ? "1" : "0";
          li.style.transform = on ? "none" : "translateY(16px)";
        });
      });
      const hs = hotspotLayer.current;
      if (hs) {
        const on = p >= 0.44 && p < 0.535;
        hs.style.visibility = on ? "visible" : "hidden";
        hs.querySelectorAll<HTMLElement>("[data-hotspot]").forEach((b, n) => {
          const appear = clamp01((p - 0.44 - n * 0.006) / 0.01);
          b.style.opacity = String(on ? appear : 0);
          b.style.transform = `translate(-50%,-50%) scale(${0.8 + 0.2 * appear})`;
        });
      }
      const pk = packLayer.current;
      if (pk) {
        pk.querySelectorAll<HTMLElement>("[data-pack]").forEach((it, n) => {
          const t = clamp01((p - 0.82 - n * 0.006) / 0.04);
          const out = clamp01((p - 0.9) / 0.02);
          it.style.opacity = String(t * (1 - out));
          it.style.transform = `translate(${(1 - t) * (n % 2 ? 60 : -60)}px, ${(1 - t) * 30}px)`;
        });
      }
    };

    /* position hotspots over the frame using the same cover-fit as the canvas */
    const placeHotspots = () => {
      const hs = hotspotLayer.current;
      if (!hs) return;
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      const s = Math.max(w / VW, h / VH);
      const focusX = mobile ? 860 : VW / 2;
      hs.querySelectorAll<HTMLElement>("[data-hotspot]").forEach((b) => {
        const x = Number(b.dataset.x);
        const y = Number(b.dataset.y) + 30; /* camera lift in scene 4 */
        b.style.left = `${w / 2 - focusX * s + x * s}px`;
        b.style.top = `${(h - VH * s) / 2 + y * s}px`;
      });
    };
    placeHotspots();

    let st: { kill: () => void } | null = null;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) request();
    });
    io.observe(el);

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const proxy = { p: 0 };
      const tween = gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          onLeave: () => {
            try {
              sessionStorage.setItem(SEEN, "1");
            } catch {}
          },
        },
        onUpdate: () => {
          progressRef.current = proxy.p;
          updateDom(proxy.p);
          request();
        },
      });
      st = { kill: () => tween.scrollTrigger?.kill() };
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      updateDom(0);
      request();
    })();

    const onResize = () => {
      size();
      placeHotspots();
      request();
    };
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      st?.kill();
      window.removeEventListener("resize", onResize);
    };
  }, [mode, mobile, manifest]);

  const visibleScenes = scenes.filter((s) => !mobile || s.mobile);
  const scene1 = scenes[0];

  /* ---------- Stills: reduced motion, Save-Data, low power, no script ---------- */
  if (mode === "stills" || mode === "pending") {
    return (
      <section aria-labelledby="hero-h1" className="on-dark bg-pine text-snow">
        <a href="#shop-by-camp" className="sr-only-focusable absolute left-4 top-20 z-10 rounded-md bg-snow px-4 py-2 font-semibold text-pine">
          Skip intro
        </a>
        <Still scene={scene1} first>
          {mode === "stills" && (
            <button onClick={play} className="mt-6 text-[15px] font-semibold underline underline-offset-4">
              Play the full intro
            </button>
          )}
        </Still>
        {mode === "stills" &&
          scenes
            .filter((s) => [2, 4, 5, 6].includes(s.id))
            .map((s) => <Still key={s.id} scene={s} />)}
        <HeroSummary />
      </section>
    );
  }

  /* ---------- Collapsed: returning visitor in the same session ---------- */
  if (mode === "collapsed") {
    return (
      <section aria-labelledby="hero-h1" className="on-dark relative bg-pine text-snow">
        <Still scene={scene1} first>
          <button onClick={play} className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold underline underline-offset-4">
            Replay the intro
          </button>
        </Still>
        <HeroSummary />
      </section>
    );
  }

  /* ---------- Motion ---------- */
  return (
    <section aria-labelledby="hero-h1" className="relative">
      <div ref={wrap} className="relative" style={{ height: mobile ? "400vh" : "700vh" }}>
        <div className="sticky top-0 h-dvh overflow-hidden bg-[#10242a]">
          <a
            href="#shop-by-camp"
            className="sr-only-focusable absolute left-4 top-20 z-30 rounded-md bg-snow px-4 py-2 font-semibold text-pine"
          >
            Skip intro
          </a>
          <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" style={{ willChange: "contents" }} />
          {/* scrim for text contrast over the scene */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent max-md:bg-gradient-to-b" />

          {visibleScenes.map((sc) => (
            <div
              key={sc.id}
              ref={(n) => {
                layers.current[sc.id] = n;
              }}
              className={`absolute inset-0 z-10 flex transition-none ${
                sc.id === 8 ? "items-end pb-10" : "items-end pb-28 md:items-center md:pb-0"
              } ${sc.id > 1 ? "invisible opacity-0" : ""}`}
            >
              <div
                className={`container-site ${sc.align === "right" ? "md:flex md:justify-end" : ""} ${sc.align === "center" ? "text-center" : ""}`}
              >
                {sc.id === 8 ? (
                  /* Scene 8 settles onto the page colour; the pin releases straight into
                     homepage section 2, which is the same CampCards component. */
                  <div className="text-center text-charcoal">
                    <p className="font-display text-[32px] md:text-[48px]">{sc.heading}</p>
                    <p className="mt-2 text-stone-deep">Hunt · Glamp · Outfit · Stoves</p>
                  </div>
                ) : (
                  <SceneText scene={sc} dark={sc.id < 7} />
                )}
              </div>
            </div>
          ))}

          {/* Scene 4 hotspots: focusable buttons that open a short card */}
          <div ref={hotspotLayer} className="invisible absolute inset-0 z-20 max-md:hidden">
            {heroHotspots.map((h, i) => (
              <Hotspot key={h.id} n={i + 1} {...h} />
            ))}
          </div>
          {/* Scene 4 on mobile: caption carousel replaces hotspots */}

          {/* Scene 7: DOM cut-outs (lighter than 32 frames) */}
          <div ref={packLayer} aria-hidden className="pointer-events-none absolute inset-0 z-[5] grid place-items-center">
            <div className="grid w-[min(92vw,820px)] grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
              {packItems.slice(0, mobile ? 4 : 6).map((name, n) => (
                <div data-pack key={name} className="rounded-md border border-line bg-snow/90 p-3 opacity-0">
                  <TentIllustration kind={n === 3 ? "cot" : n === 5 || n === 2 ? "bag" : "gear"} className="h-20 w-full md:h-28" />
                  <p className="mt-1 text-center text-[13px] font-semibold text-charcoal">{name}</p>
                </div>
              ))}
            </div>
          </div>

          {lagging && <div aria-hidden className="absolute inset-x-0 bottom-0 z-30 h-0.5 animate-pulse bg-ember" />}
        </div>
      </div>
      <HeroSummary />
    </section>
  );
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function SceneText({ scene: sc, dark }: { scene: Scene; dark: boolean }) {
  const H = sc.id === 1 ? "h1" : "p";
  return (
    <div className={`max-w-xl ${dark ? "on-dark text-snow" : "text-charcoal"} ${sc.align === "center" ? "mx-auto" : ""}`}>
      {sc.eyebrow && <p className="eyebrow mb-3 opacity-90">{sc.eyebrow}</p>}
      <H id={sc.id === 1 ? "hero-h1" : undefined} className={`font-display font-semibold ${sc.id === 1 ? "" : "text-[26px] leading-8 md:text-[40px] md:leading-[46px]"}`}>
        {sc.heading}
      </H>
      {sc.lines && (
        <ul className="mt-4 space-y-2 text-[17px] leading-7">
          {sc.lines.map((l) => (
            <li key={l} data-line className="transition-[opacity,transform] duration-300 ease-out">
              {l}
            </li>
          ))}
        </ul>
      )}
      {sc.id === 4 && (
        <ul className="mt-4 space-y-1 text-[16px] md:hidden">
          {heroHotspots.map((h) => (
            <li key={h.id} data-line className="transition-[opacity,transform] duration-300">
              · {h.label}
            </li>
          ))}
        </ul>
      )}
      {sc.smallPrint && <p className="mt-3 text-[14px] opacity-85">{sc.smallPrint}</p>}
      {sc.ctas && (
        <div className={`mt-6 flex flex-col gap-3 sm:flex-row ${sc.align === "center" ? "sm:justify-center" : ""}`}>
          {sc.ctas.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`inline-flex min-h-12 items-center justify-center rounded-md px-5 font-semibold ${
                c.variant === "inverse"
                  ? dark
                    ? "border-2 border-snow text-snow hover:bg-snow hover:text-pine"
                    : "border-2 border-pine text-pine hover:bg-pine hover:text-snow"
                  : "bg-ember-deep text-snow hover:bg-[#a9470c]"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Hotspot({ n, id, label, x, y }: { n: number; id: string; label: string; x: number; y: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div data-hotspot data-x={x} data-y={y} className="absolute opacity-0" style={{ left: 0, top: 0 }}>
      <button
        aria-expanded={open}
        aria-controls={`hs-${id}`}
        onClick={() => setOpen((o) => !o)}
        className="grid size-9 place-items-center rounded-full border-2 border-snow bg-ember-deep text-[14px] font-bold text-snow shadow-2"
      >
        {n}
        <span className="sr-only">: {label}</span>
      </button>
      <div id={`hs-${id}`} hidden={!open} className="absolute left-11 top-0 w-60 rounded-md bg-snow p-3 text-[14px] text-charcoal shadow-2">
        {label}
      </div>
    </div>
  );
}

function Still({ scene: sc, first, children }: { scene: Scene; first?: boolean; children?: React.ReactNode }) {
  return (
    <div className={`relative overflow-hidden ${first ? "min-h-[88dvh] pt-[72px]" : "border-t border-snow/10"} flex items-center`}>
      <div className="container-site grid items-center gap-8 py-14 md:grid-cols-2">
        <div>
          <SceneText scene={sc} dark />
          {children}
        </div>
        <TentIllustration kind={stillArt[sc.id] ?? "wall"} tone="dark" className="mx-auto w-full max-w-md" />
      </div>
    </div>
  );
}

/** Visually hidden summary of the eight scenes and their text (ch. 12, 20). */
function HeroSummary() {
  return (
    <div className="sr-only">
      <h2>About the Raising Camp introduction</h2>
      <ol>
        {scenes.map((s) => (
          <li key={s.id}>
            {s.name}: {[s.eyebrow, s.heading, ...(s.lines ?? []), s.smallPrint].filter(Boolean).join(". ")}
          </li>
        ))}
      </ol>
    </div>
  );
}
