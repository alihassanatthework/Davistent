"use client";

import { useState } from "react";
import { standardFeatures } from "@/content/features";
import { TentIllustration } from "../TentIllustration";

/**
 * Standard features (homepage section 6, /guides/standard-features/, tent pages).
 * Seven numbered hotspots on a tent drawing on desktop; a numbered list beside a
 * static image on mobile. Hotspots are buttons with aria-expanded; content is in the DOM.
 */
export function FeatureHotspots({ dark }: { dark?: boolean }) {
  const [active, setActive] = useState<string | null>(standardFeatures[0].id);
  const current = standardFeatures.find((f) => f.id === active);
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
      <div className="relative lg:col-span-7">
        <TentIllustration kind="wall" tone={dark ? "dark" : "light"} className="w-full" />
        <div className="absolute inset-0 max-md:hidden">
          {standardFeatures.map((f, i) => (
            <button
              key={f.id}
              aria-expanded={active === f.id}
              aria-controls="feature-card"
              onClick={() => setActive(active === f.id ? null : f.id)}
              style={{ left: `${f.hotspot.x}%`, top: `${f.hotspot.y}%` }}
              className={`absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-sm border-2 text-[14px] font-bold transition-transform duration-150 hover:scale-110 ${
                active === f.id ? "border-bone bg-ember-deep text-snow" : "border-ember-deep bg-snow text-ember-deep"
              }`}
            >
              {i + 1}
              <span className="sr-only">: {f.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-5">
        {current && (
          <div id="feature-card" aria-live="polite" className={`mb-6 rounded-md p-5 max-md:hidden ${dark ? "bg-bone/10" : "bg-snow"} border border-line/50`}>
            <p className="eyebrow opacity-80">Feature {standardFeatures.indexOf(current) + 1} of 7</p>
            <h3 className="mt-1">{current.name}</h3>
            <p className="data mt-2">{current.spec}</p>
            <p className="mt-2 text-[15px] opacity-90">{current.detail}</p>
          </div>
        )}
        <ol className="space-y-3">
          {standardFeatures.map((f, i) => (
            <li key={f.id} className="flex gap-3">
              <span className="data grid size-7 shrink-0 place-items-center rounded-sm border border-current text-[13px]">{i + 1}</span>
              <div>
                <p className="font-semibold">{f.name}</p>
                <p className="text-[15px] leading-6 opacity-85 md:sr-only">{f.spec}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
