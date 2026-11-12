"use client";

import { useState } from "react";

/** Go Tent pole-system toggle: switches peak height and weight values from existing data (ch. 14). */
const data = {
  "10x10": {
    traditional: { peak: "6' 8\"", poles: "25 lb" },
    internal: { peak: "6' 5\"", poles: "54 lb" },
    tent: "about 40 lb with sewn floor",
  },
  "12x12": {
    traditional: { peak: "7' 2\"", poles: "printed as “39bs” — to confirm" },
    internal: { peak: "7' 0\"", poles: "62 lb" },
    tent: "57 lb with sewn floor",
  },
} as const;

export function PoleToggle() {
  const [size, setSize] = useState<keyof typeof data>("10x10");
  const [sys, setSys] = useState<"traditional" | "internal">("traditional");
  const d = data[size];
  return (
    <div className="rounded-md border border-line bg-snow p-5">
      <div className="flex flex-wrap gap-6">
        <fieldset>
          <legend className="eyebrow mb-2 text-stone-deep">Size</legend>
          <div className="flex gap-2">
            {(Object.keys(data) as (keyof typeof data)[]).map((s) => (
              <label key={s} className={`inline-flex min-h-11 cursor-pointer items-center rounded-md border px-4 font-semibold ${size === s ? "border-pine bg-pine text-bone" : "border-line"}`}>
                <input type="radio" className="sr-only" checked={size === s} onChange={() => setSize(s)} name="gt-size" />
                {s.replace("x", "' × ")}'
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="eyebrow mb-2 text-stone-deep">Pole system</legend>
          <div className="flex gap-2">
            {(["traditional", "internal"] as const).map((s) => (
              <label key={s} className={`inline-flex min-h-11 cursor-pointer items-center rounded-md border px-4 font-semibold capitalize ${sys === s ? "border-pine bg-pine text-bone" : "border-line"}`}>
                <input type="radio" className="sr-only" checked={sys === s} onChange={() => setSys(s)} name="gt-sys" />
                {s === "internal" ? "Internal frame" : "Traditional poles"}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-4" aria-live="polite">
        <div>
          <dt className="text-[13px] text-stone">Peak height</dt>
          <dd className="data text-[20px] font-semibold">{d[sys].peak}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-stone">Pole weight</dt>
          <dd className="data text-[16px] font-semibold">{d[sys].poles}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-stone">Tent</dt>
          <dd className="data text-[14px]">{d.tent}</dd>
        </div>
      </dl>
      <p className="mt-4 text-[13px] text-stone">Walls are 34". Internal frames are not compatible with sewn-in floors.</p>
    </div>
  );
}
