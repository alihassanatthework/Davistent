"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  type Build,
  type Option,
  builderSizes,
  checkRules,
  colours,
  customRate,
  decodeBuild,
  destinations,
  encodeBuild,
  floorOptions,
  flyOptions,
  frameOptions,
  openings,
  priceBuild,
  treatments,
} from "@/content/builder";
import { formatPrice, stoveFor } from "@/content/catalog";
import { site } from "@/content/site";
import { useCart } from "../Cart";
import { Button, Icon, Notice } from "../ui";

const steps = ["Size", "Treatment", "Openings", "Frame or poles", "Floor and fly", "Review"] as const;

/**
 * Custom tent builder (ch. 14): six steps, a line drawing that updates at each
 * step, price always visible, rules enforced as the buyer goes, builds saved
 * and shared by link, or sent to Davis with a question.
 */
export function TentBuilder() {
  const params = useSearchParams();
  const router = useRouter();
  const [b, setB] = useState<Build>(() => decodeBuild(new URLSearchParams(params.toString())));
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [custom, setCustom] = useState({ w: 18, l: 30 });
  const heading = useRef<HTMLHeadingElement>(null);
  const { add } = useCart();

  const rules = useMemo(() => checkRules(b), [b]);
  const price = useMemo(() => priceBuild(b), [b]);
  const blocking = rules.filter((r) => r.level === "block");
  const set = (patch: Partial<Build>) => setB((cur) => ({ ...cur, ...patch }));

  /* keep the URL in sync so a build can be shared */
  useEffect(() => {
    const t = setTimeout(() => router.replace(`/build/?${encodeBuild(b)}`, { scroll: false }), 250);
    return () => clearTimeout(t);
  }, [b, router]);

  const go = (i: number) => {
    setStep(i);
    requestAnimationFrame(() => heading.current?.focus());
  };

  const share = async () => {
    const url = `${window.location.origin}/build/?${encodeBuild(b)}`;
    try {
      if (navigator.share) await navigator.share({ title: "My Davis Tent build", url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch {}
  };

  const summary = [
    `${price.size.w}' × ${price.size.l}'`,
    treatments.find((t) => t.id === b.treatment)?.label,
    colours.find((c) => c.id === b.colour)?.label,
    openings.stoveJack.find((o) => o.id === b.stoveJack)?.label,
    openings.windows.find((o) => o.id === b.windows)?.label,
    ...b.extras.map((e) => openings.extras.find((o) => o.id === e)?.label),
    frameOptions.find((o) => o.id === b.frame)?.label,
    floorOptions.find((o) => o.id === b.floor)?.label,
    flyOptions.find((o) => o.id === b.fly)?.label,
  ].filter(Boolean) as string[];

  const customArea = custom.w * custom.l;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        {/* progress */}
        <nav aria-label="Builder steps" className="mb-6">
          <ol className="scrollbar-none flex gap-2 overflow-x-auto">
            {steps.map((s, i) => (
              <li key={s} className="shrink-0">
                <button
                  onClick={() => go(i)}
                  aria-current={i === step ? "step" : undefined}
                  className={`flex min-h-11 items-center gap-2 rounded-sm border px-3 text-[14px] font-semibold ${
                    i === step ? "border-pine bg-pine text-bone" : i < step ? "border-pine text-pine" : "border-line text-stone-deep"
                  }`}
                >
                  <span className="data grid size-6 place-items-center rounded-sm border border-current text-[12px]">{i < step ? "✓" : i + 1}</span>
                  {s}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="rounded-md border border-line bg-snow p-4 md:p-6">
          <h2 ref={heading} tabIndex={-1} className="mb-1 text-[28px] focus:outline-none">
            {step + 1}. {steps[step]}
          </h2>

          {step === 0 && (
            <>
              <p className="mb-4 text-stone-deep">All sizes have 5' walls (cut size). Floor area and the matching stove update as you choose.</p>
              <Chips
                name="size"
                value={b.size}
                onChange={(size) => set({ size })}
                options={builderSizes.map((s) => ({
                  id: s.id,
                  label: `${s.w}' × ${s.l}'`,
                  price: s.base,
                  note: `sleeps ${s.sleeps} · ${s.w * s.l} sq ft · ${stoveFor(s.w * s.l).name} stove`,
                }))}
                absolute
              />
              <details className="mt-6 rounded-md border border-dashed border-stone p-4">
                <summary className="cursor-pointer font-semibold">Need something bigger than 16' × 25'?</summary>
                <p className="mt-3 text-[15px]">{`Custom tents over ${customRate.minArea} sq ft are priced per square foot. We will confirm the exact quote by phone.`}</p>
                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <label className="text-[14px]">
                    Width (ft)
                    <input type="number" min={8} max={40} value={custom.w} onChange={(e) => setCustom((c) => ({ ...c, w: Number(e.target.value) }))} className="mt-1 block h-11 w-24 rounded-md border border-line px-2" />
                  </label>
                  <label className="text-[14px]">
                    Length (ft)
                    <input type="number" min={8} max={60} value={custom.l} onChange={(e) => setCustom((c) => ({ ...c, l: Number(e.target.value) }))} className="mt-1 block h-11 w-24 rounded-md border border-line px-2" />
                  </label>
                </div>
                <p className="data mt-3" aria-live="polite">
                  {customArea} sq ft · guide {formatPrice(customArea * customRate.waterMildew)} (water and mildew) or {formatPrice(customArea * customRate.fire)} (water, mildew and fire)
                </p>
                <a href={`tel:${site.phone.tel}`} className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-pine underline">
                  <Icon name="phone" className="size-4" /> Call for a quote
                </a>
              </details>
            </>
          )}

          {step === 1 && (
            <>
              <label className="mb-4 block">
                <span className="mb-1 block font-semibold">Where will the tent ship?</span>
                <select value={b.destination} onChange={(e) => set({ destination: e.target.value })} className="h-12 w-full max-w-xs rounded-md border border-line bg-snow px-3">
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </label>
              <Chips name="treatment" value={b.treatment} onChange={(treatment) => set({ treatment })} options={treatments} />
              <h3 className="mb-2 mt-6">Canvas colour</h3>
              <Chips name="colour" value={b.colour} onChange={(colour) => set({ colour })} options={colours} />
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="mb-2">Stove jack</h3>
              <Chips name="jack" value={b.stoveJack} onChange={(stoveJack) => set({ stoveJack })} options={openings.stoveJack} />
              <p className="mt-2 text-[14px] text-stone">The jack location can be changed for no additional charge.</p>
              <h3 className="mb-2 mt-6">Windows</h3>
              <Chips name="windows" value={b.windows} onChange={(windows) => set({ windows })} options={openings.windows} />
              <h3 className="mb-2 mt-6">Doors</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {openings.extras.map((o) => (
                  <label key={o.id} className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-md border p-3 ${b.extras.includes(o.id) ? "border-pine ring-1 ring-pine" : "border-line"}`}>
                    <input
                      type="checkbox"
                      className="mt-1 size-4 accent-ink"
                      checked={b.extras.includes(o.id)}
                      onChange={() => set({ extras: b.extras.includes(o.id) ? b.extras.filter((x) => x !== o.id) : [...b.extras, o.id] })}
                    />
                    <span>
                      <span className="block font-semibold">{o.label}</span>
                      <span className="block text-[13px] text-stone">{o.note}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-[14px] text-stone">A zippered door with a heavy-duty #10 YKK coil zipper is standard.</p>
            </>
          )}

          {step === 3 && (
            <>
              <p className="mb-4 text-stone-deep">Frames are not included with tents. Internal frames suit long-term setups; traditional poles pack smaller and weigh about half as much.</p>
              <Chips name="frame" value={b.frame} onChange={(frame) => set({ frame })} options={frameOptions} />
            </>
          )}

          {step === 4 && (
            <>
              <h3 className="mb-2">Floor</h3>
              <Chips name="floor" value={b.floor} onChange={(floor) => set({ floor })} options={floorOptions} />
              <h3 className="mb-2 mt-6">Rain fly</h3>
              <Chips name="fly" value={b.fly} onChange={(fly) => set({ fly })} options={flyOptions} />
            </>
          )}

          {step === 5 && (
            <div>
              <ul className="space-y-1">
                {summary.map((s) => (
                  <li key={s} className="flex gap-2">
                    <Icon name="check" className="mt-0.5 size-5 shrink-0 text-success" /> {s}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  disabled={blocking.length > 0}
                  onClick={() =>
                    add({
                      id: `build:${encodeBuild(b)}`,
                      name: `Custom wall tent ${price.size.w}' × ${price.size.l}'`,
                      price: price.total,
                      href: `/build/?${encodeBuild(b)}`,
                      options: summary.slice(1),
                    })
                  }
                >
                  Add to cart
                </Button>
                <Button variant="secondary" onClick={share}>
                  {copied ? "Link copied" : "Save or share this build"}
                </Button>
                <a
                  className="inline-flex min-h-12 items-center font-semibold text-pine underline"
                  href={`/contact/?topic=builder&build=${encodeURIComponent(encodeBuild(b))}`}
                >
                  Ask Davis about this build
                </a>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between border-t border-line pt-4">
            <Button variant="tertiary" onClick={() => go(Math.max(0, step - 1))} disabled={step === 0}>
              Back
            </Button>
            {step < steps.length - 1 && <Button onClick={() => go(step + 1)}>Next: {steps[step + 1]}</Button>}
          </div>
        </div>
      </div>

      {/* live drawing and price */}
      <aside className="lg:col-span-5" aria-label="Your tent">
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-md border border-line bg-snow p-4">
            <BuildDrawing b={b} />
          </div>
          <div className="rounded-md border border-line bg-snow p-4" aria-live="polite">
            <p className="eyebrow text-stone-deep">Your build</p>
            <p className="data mt-1 text-[28px] font-semibold">{formatPrice(price.total)}</p>
            <ul className="mt-3 space-y-1 text-[14px]">
              {price.lines.map((l) => (
                <li key={l.label} className="flex justify-between gap-3">
                  <span>{l.label}</span>
                  <span className="data shrink-0">
                    {l.price >= 0 ? formatPrice(l.price) : `−${formatPrice(-l.price)}`}
                    {l.estimate && <span title="Estimate until store data is connected">*</span>}
                  </span>
                </li>
              ))}
            </ul>
            {price.hasEstimates && (
              <p className="mt-3 text-[12px] text-stone">* Placeholder price. Final add-on prices come from the Davis Tent store before launch.</p>
            )}
          </div>
          {rules.map((r) => (
            <Notice key={r.id} tone={r.level === "block" ? "block" : r.level === "warn" ? "warn" : "info"} role={r.level === "block" ? "alert" : "status"}>
              {r.message}{" "}
              {r.fix && (
                <button className="font-semibold underline" onClick={() => set(r.fix!)}>
                  Fix this
                </button>
              )}
            </Notice>
          ))}
        </div>
      </aside>
    </div>
  );
}

function Chips({ name, value, onChange, options, absolute }: { name: string; value: string; onChange: (v: string) => void; options: Option[]; absolute?: boolean }) {
  return (
    <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">
      {options.map((o) => {
        const sel = value === o.id;
        return (
          <label
            key={o.id}
            className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-md border p-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-pine ${
              sel ? "border-pine bg-pine/5 ring-1 ring-pine" : "border-line bg-snow hover:border-pine/50"
            }`}
          >
            <input type="radio" name={name} checked={sel} onChange={() => onChange(o.id)} className="mt-1 size-4 accent-ink" />
            <span className="flex-1">
              <span className="block font-semibold">{o.label}</span>
              {o.note && <span className="block text-[13px] leading-5 text-stone">{o.note}</span>}
            </span>
            {(o.price !== 0 || absolute) && (
              <span className="data shrink-0 text-[13px]">
                {absolute ? `from ${formatPrice(o.price)}` : o.price > 0 ? `+${formatPrice(o.price)}` : `−${formatPrice(-o.price)}`}
                {o.estimate && "*"}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}

/** Line drawing of the tent that updates with each choice. */
function BuildDrawing({ b }: { b: Build }) {
  const s = builderSizes.find((x) => x.id === b.size) ?? builderSizes[4];
  const k = 0.75 + (s.l / 25) * 0.35; /* scale with length */
  const gold = b.colour === "autumn-gold";
  const cloth = gold ? "#E9C987" : "#FFFFFF";
  return (
    <svg viewBox="0 0 400 260" className="w-full" role="img" aria-label={`Drawing of a ${s.w} by ${s.l} foot wall tent with the chosen options`}>
      <line x1="10" y1="230" x2="390" y2="230" stroke="#C9B48A" strokeWidth="3" />
      <g transform={`translate(200 230) scale(${k}) translate(-200 -230)`} stroke="#1F3A2E" strokeWidth="2" strokeLinejoin="round" fill={cloth}>
        {b.floor !== "floor-none" && <path d="M95 232 L265 232 L335 212 L180 212 Z" fill="#C9B48A" stroke="none" opacity={b.floor === "floor-34" ? 0.6 : 0.9} />}
        {b.frame !== "frame-none" && (
          <g stroke="#555A55" strokeDasharray={b.frame === "angles-only" ? "4 4" : undefined} fill="none">
            <path d="M100 230 V150 L180 100 L260 150 V230 M260 150 L330 130 V212 M180 100 L250 80 L330 130" />
          </g>
        )}
        <path d="M100 230 V150 L180 100 L260 150 V230 Z" />
        <path d="M260 150 L330 130 V212 L260 230 Z" fill={gold ? "#DDB774" : "#ECE7DC"} />
        <path d="M180 100 L250 80 L330 130 L260 150 Z" fill={gold ? "#E2BF7C" : "#F7F3EA"} />
        {/* door, zippered */}
        <path d="M160 230 V178 Q180 170 200 178 V230" fill="none" />
        <line x1="180" y1="174" x2="180" y2="230" strokeDasharray="3 3" />
        {b.extras.includes("colorado-door") && <path d="M150 230 V170 L180 160 L210 170 V230" fill="none" stroke="#5A5F3A" strokeWidth="2.5" />}
        {b.extras.includes("screen-door") && <rect x="163" y="182" width="34" height="46" fill="none" stroke="#555A55" strokeDasharray="1 3" />}
        {/* windows */}
        <rect x="275" y="165" width="34" height="24" rx="1" fill="#ECE7DC" />
        {b.windows === "win-2" && (
          <>
            <rect x="112" y="170" width="26" height="22" rx="1" fill="#ECE7DC" />
            <rect x="222" y="170" width="26" height="22" rx="1" fill="#ECE7DC" />
          </>
        )}
        {/* stove jack, inside left as you enter → right roof plane from this view */}
        {b.stoveJack !== "jack-none" && (
          <g>
            <circle cx="292" cy="110" r={b.stoveJack === "jack-6" ? 9 : b.stoveJack === "jack-4" ? 6 : 7.5} fill="#141615" />
            <path d="M292 110 V70" stroke="#141615" strokeWidth="5" />
          </g>
        )}
        {b.fly !== "fly-none" && (
          <path d="M88 152 L180 90 L254 70 L342 126" fill="none" stroke={b.fly === "fly-canvas" ? "#C9B48A" : "#6B4F3A"} strokeWidth="5" />
        )}
      </g>
      <text x="200" y="252" textAnchor="middle" fontSize="13" fill="#141615" fontFamily="var(--font-jetbrains)">
        {s.w}' × {s.l}' · {s.w * s.l} sq ft
      </text>
    </svg>
  );
}
