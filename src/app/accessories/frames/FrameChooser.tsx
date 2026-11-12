"use client";

import { useState } from "react";

/** Frame chooser by trip type (ch. 13). */
export function FrameChooser() {
  const [trip, setTrip] = useState<"long" | "pack" | "drive">("drive");
  const rec = {
    long: { t: "Complete internal frame", d: "Internal frames suit long-term setups. Complete 3, 4, 5 and 6 column frames are available." },
    pack: { t: "Traditional pole system", d: "Traditional poles pack smaller, weigh about half as much and can be packed on horseback." },
    drive: { t: "Angle kit only", d: "Order angles only with a cut list and buy 1\" EMT locally to save freight. A 14' × 15' tent needs 17 sticks in 10' lengths." },
  }[trip];
  return (
    <div className="grid gap-6 rounded-md border border-line p-5 md:grid-cols-2">
      <fieldset>
        <legend className="font-semibold">How will you use the tent?</legend>
        {(
          [
            ["long", "Set up for a season or longer"],
            ["pack", "Packed in by horse or mule"],
            ["drive", "Drive-in camp, set up each trip"],
          ] as const
        ).map(([id, label]) => (
          <label key={id} className="mt-2 flex min-h-11 items-center gap-3">
            <input type="radio" name="trip" checked={trip === id} onChange={() => setTrip(id)} className="size-5 accent-[#1F3A2E]" />
            {label}
          </label>
        ))}
      </fieldset>
      <div aria-live="polite" className="rounded-md bg-canvas p-5">
        <p className="eyebrow text-stone-deep">We suggest</p>
        <p className="mt-1 font-display text-[26px]">{rec.t}</p>
        <p className="mt-2 text-[15px]">{rec.d}</p>
      </div>
    </div>
  );
}
