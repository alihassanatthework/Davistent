"use client";

import Link from "next/link";
import { useState } from "react";
import { stoveFor, stoveFits } from "@/content/catalog";
import { sizes } from "@/components/home/SizeFinder";

export function StoveSizer() {
  const [size, setSize] = useState("14x15");
  const s = sizes.find((x) => x.id === size)!;
  const stove = stoveFor(s.w * s.l);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <fieldset>
        <legend className="mb-2 font-semibold">My tent is</legend>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((x) => (
            <label key={x.id} className={`flex min-h-12 cursor-pointer items-center justify-center rounded-md border font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pine ${size === x.id ? "border-pine bg-pine text-snow" : "border-line bg-snow"}`}>
              <input type="radio" name="tent" className="sr-only" checked={size === x.id} onChange={() => setSize(x.id)} />
              <span className="data">
                {x.w}×{x.l}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div aria-live="polite" className="rounded-md bg-charcoal p-6 text-snow on-dark">
        <p className="eyebrow opacity-80">Your stove</p>
        <p className="mt-1 font-display text-[36px]">{stove.name}</p>
        <p className="data mt-2">Fits {stove.fits}</p>
        <p className="data opacity-80">
          {stove.weight} · {stove.dims}
        </p>
        <Link href="/stoves/wood-burning-camp-stove/" className="mt-4 inline-flex min-h-12 items-center rounded-md bg-ember-deep px-5 font-semibold">
          Shop the {stove.name}
        </Link>
      </div>
      <p className="text-[13px] text-stone md:col-span-2">
        Fit ranges overlap at 12' × 15' and 14' × 15' ({stoveFits.map((f) => f.name).join(", ")}). Ask us if you are between sizes. Stove clearances to be supplied by Davis Tent.
      </p>
    </div>
  );
}
