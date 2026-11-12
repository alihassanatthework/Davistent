"use client";

import { useState } from "react";
import { byCategory, formatPrice } from "@/content/catalog";

const models = byCategory("glamping");

/** Site-count estimator: units × published model price range. A guide, not a quote. */
export function SiteEstimator() {
  const [units, setUnits] = useState(6);
  const [model, setModel] = useState(models[0].id);
  const m = models.find((x) => x.id === model)!;
  return (
    <div className="grid gap-6 rounded-md border border-line bg-snow p-5 md:grid-cols-3 md:items-end">
      <label className="block">
        <span className="font-semibold">Units</span>
        <input type="number" min={1} max={100} value={units} onChange={(e) => setUnits(Math.max(1, Number(e.target.value)))} className="mt-1 h-12 w-full rounded-md border border-line px-3" />
      </label>
      <label className="block">
        <span className="font-semibold">Model</span>
        <select value={model} onChange={(e) => setModel(e.target.value)} className="mt-1 h-12 w-full rounded-md border border-line bg-snow px-3">
          {models.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name} ({x.sizeLabel})
            </option>
          ))}
        </select>
      </label>
      <div aria-live="polite">
        <p className="text-[14px] text-stone">Tents only, before freight</p>
        <p className="data text-[22px] font-semibold">
          {formatPrice(m.priceMin * units)} – {formatPrice(m.priceMax! * units)}
        </p>
      </div>
      <p className="text-[13px] text-stone md:col-span-3">Frame poles, furniture and decks are not included. Volume pricing is quoted by Davis Tent.</p>
    </div>
  );
}
