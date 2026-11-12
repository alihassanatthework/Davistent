"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { stoveFor } from "@/content/catalog";

/** Size and sleeps pairs as listed on the current site (to be reconciled to one figure per size). */
export const sizes = [
  { id: "10x15", w: 10, l: 15, sleeps: "1-2", max: 2, href: "/tents/wall/10x15/", pkg: "Turkey" },
  { id: "12x15", w: 12, l: 15, sleeps: "1-3", max: 3, href: "/tents/wall/12x15/", pkg: "Antelope" },
  { id: "14x15", w: 14, l: 15, sleeps: "3-4", max: 4, href: "/tents/wall/14x15/", pkg: "Elk" },
  { id: "14x20", w: 14, l: 20, sleeps: "4", max: 4, href: "/tents/wall/14x20/", pkg: "Elk Plus" },
  { id: "16x20", w: 16, l: 20, sleeps: "6", max: 6, href: "/tents/wall/16x20/", pkg: "Grizzly" },
  { id: "16x25", w: 16, l: 25, sleeps: "8", max: 8, href: "/tents/wall/16x25/", pkg: "Bison" },
];

/**
 * "What size tent do I need?" (homepage section 4, /guides/size/).
 * Server-renders the default state; all six sizes are listed in HTML.
 * Slider for party size (stepper buttons below 480 px), toggles for stove and
 * eating area; the floor plan updates with cots and stove.
 */
export function SizeFinder() {
  const [party, setParty] = useState(4);
  const [stove, setStove] = useState(true);
  const [eating, setEating] = useState(true);
  const id = useId();

  /* FAQ advice: size up to leave room for a stove and an eating area. */
  const needed = party + (stove ? 1 : 0) + (eating ? 1 : 0);
  const match = sizes.find((s) => s.max >= needed) ?? sizes[sizes.length - 1];
  const tooBig = needed > 8;
  const stoveModel = stoveFor(match.w * match.l);

  return (
    <div className="grid gap-8 rounded-md border border-line bg-snow p-4 md:p-8 lg:grid-cols-2">
      <div>
        <fieldset>
          <legend className="font-semibold">How many people are sleeping in the tent?</legend>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setParty((p) => Math.max(1, p - 1))}
              className="grid size-12 place-items-center rounded-md border border-line text-[22px] sm:hidden"
              aria-label="One fewer person"
            >
              −
            </button>
            <label htmlFor={`${id}-party`} className="sr-only">
              Party size
            </label>
            <input
              id={`${id}-party`}
              type="range"
              min={1}
              max={10}
              value={party}
              onChange={(e) => setParty(Number(e.target.value))}
              className="hidden flex-1 accent-[#6B4F3A] sm:block"
              aria-valuetext={`${party} people`}
            />
            <output htmlFor={`${id}-party`} className="data min-w-20 text-center text-[28px] font-semibold" aria-live="polite">
              {party}
              <span className="block text-[13px] font-normal text-stone">{party === 1 ? "person" : "people"}</span>
            </output>
            <button
              type="button"
              onClick={() => setParty((p) => Math.min(10, p + 1))}
              className="grid size-12 place-items-center rounded-md border border-line text-[22px] sm:hidden"
              aria-label="One more person"
            >
              +
            </button>
          </div>
        </fieldset>
        <fieldset className="mt-6 space-y-3">
          <legend className="font-semibold">Room for</legend>
          <label className="flex min-h-11 items-center gap-3">
            <input type="checkbox" checked={stove} onChange={(e) => setStove(e.target.checked)} className="size-5 accent-ink" />
            A wood stove
          </label>
          <label className="flex min-h-11 items-center gap-3">
            <input type="checkbox" checked={eating} onChange={(e) => setEating(e.target.checked)} className="size-5 accent-ink" />
            An eating and gear area
          </label>
        </fieldset>

        <div className="mt-6 rounded-md bg-canvas p-4" aria-live="polite">
          {tooBig ? (
            <p>
              For a party this size, consider two tents or a custom size. Tents larger than 16' × 25' are quoted by phone.
            </p>
          ) : (
            <>
              <p className="eyebrow text-stone-deep">We recommend</p>
              <p className="mt-1 font-display text-[28px] font-semibold">
                {match.w}' × {match.l}'
              </p>
              <p className="data text-stone">
                sleeps {match.sleeps} (as listed) · {match.w * match.l} sq ft · {stoveModel.name} stove
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={match.href} className="inline-flex min-h-12 items-center rounded-md bg-blaze text-ink px-5 font-semibold hover:bg-blaze-deep hover:text-white">
                  See this size
                </Link>
                <Link href="/hunting/packages/" className="inline-flex min-h-12 items-center rounded-md border-2 border-pine px-5 font-semibold text-pine hover:bg-pine hover:text-bone">
                  {match.pkg} package with stove
                </Link>
              </div>
            </>
          )}
          <p className="mt-3 text-[13px] text-stone">If you are between sizes, size up.</p>
        </div>
      </div>

      <div>
        <FloorPlan w={match.w} l={match.l} cots={Math.min(party, match.max + 2)} stove={stove} eating={eating} />
        <ul className="mt-4 grid grid-cols-3 gap-2 text-center text-[13px]" aria-label="All wall tent sizes">
          {sizes.map((s) => (
            <li key={s.id}>
              <Link
                href={s.href}
                aria-current={s.id === match.id ? "true" : undefined}
                className="block rounded-sm border border-line px-2 py-2 aria-[current=true]:border-pine aria-[current=true]:bg-pine aria-[current=true]:text-bone"
              >
                <span className="data block text-[14px] font-semibold">
                  {s.w}×{s.l}
                </span>
                sleeps {s.sleeps}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Top-down floor plan, 1 ft = 16 px. Cots are 7' × 2'6" (Big Boy cot). */
export function FloorPlan({ w, l, cots, stove, eating }: { w: number; l: number; cots: number; stove: boolean; eating: boolean }) {
  const S = 16;
  const W = l * S;
  const H = w * S;
  const cotW = 7 * S;
  const cotH = 2.5 * S;
  /* cots along both long walls from the back, then across the back wall */
  const gap = S * 0.5;
  const perSide = Math.max(1, Math.floor((W - S * 4) / (cotW + gap)));
  const positions: [number, number][] = [];
  for (const y of [gap, H - cotH - gap]) for (let n = 0; n < perSide; n++) positions.push([W - gap - cotW - n * (cotW + gap), y]);
  for (let y = gap + cotH + gap; y + cotH <= H - cotH - gap * 2; y += cotH + gap) positions.push([W - gap - cotW, y]);
  const placed = positions.slice(0, cots);
  return (
    <figure>
      <svg viewBox={`-20 -20 ${W + 40} ${H + 60}`} className="w-full" role="img" aria-label={`Floor plan of a ${w} by ${l} foot tent with ${placed.length} cots${stove ? " and a stove" : ""}`}>
        <rect x="0" y="0" width={W} height={H} fill="#ECE7DC" stroke="#1F3A2E" strokeWidth="2" />
        {/* door on the front (left) wall */}
        <line x1="0" y1={H / 2 - S * 1.5} x2="0" y2={H / 2 + S * 1.5} stroke="#ECE7DC" strokeWidth="4" />
        <text x="-12" y={H / 2 + 4} fontSize="11" textAnchor="end" fill="#555A55">door</text>
        {placed.map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={cotW} height={cotH} rx="3" fill="#FFFFFF" stroke="#555A55" />
        ))}
        {stove && (
          <g>
            {/* stove jack standard location: inside left as you enter */}
            <rect x={S * 1.5} y={S * 0.6} width={S * 2} height={S * 1.2} fill="#141615" />
            <circle cx={S * 2.5} cy={S * 1.2} r="3" fill="#6B4F3A" />
          </g>
        )}
        {eating && <rect x={S * 2} y={H / 2 - S * 1.5} width={S * 3} height={S * 3} rx="2" fill="none" stroke="#5A5F3A" strokeDasharray="4 3" />}
        <text x={W / 2} y={H + 30} fontSize="13" textAnchor="middle" fill="#141615" fontFamily="var(--font-jetbrains)">
          {l}' long × {w}' wide
        </text>
      </svg>
      <figcaption className="mt-2 text-[13px] text-stone">
        Schematic. Cots shown at 7' × 2' 6". Stove at the standard jack location, inside left as you enter.
      </figcaption>
    </figure>
  );
}
