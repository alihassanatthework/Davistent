"use client";

import { useState } from "react";

const items = [
  { id: "cot", name: "Big Boy cot" },
  { id: "pad", name: "Cot pad" },
  { id: "cover", name: "Sleeping bag cover" },
  { id: "organizer", name: "Cot organizer ($25)" },
];

/** Sleep bundle builder: shows the package saving (the current site lists a $14 saving on the cot package). */
export function BundleBuilder() {
  const [on, setOn] = useState<Set<string>>(new Set(["cot", "pad"]));
  const complete = on.has("cot") && on.has("pad") && on.has("cover");
  return (
    <div className="rounded-md border border-line bg-snow p-5">
      <h2 className="text-[26px]">Build a sleep system</h2>
      <fieldset className="mt-4">
        <legend className="sr-only">Items</legend>
        <div className="flex flex-wrap gap-2">
          {items.map((i) => (
            <label key={i.id} className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 font-semibold ${on.has(i.id) ? "border-pine bg-pine text-bone" : "border-line"}`}>
              <input
                type="checkbox"
                className="sr-only"
                checked={on.has(i.id)}
                onChange={() =>
                  setOn((s) => {
                    const n = new Set(s);
                    if (n.has(i.id)) n.delete(i.id);
                    else n.add(i.id);
                    return n;
                  })
                }
              />
              {on.has(i.id) ? "✓" : "+"} {i.name}
            </label>
          ))}
        </div>
      </fieldset>
      <p className="mt-4" aria-live="polite">
        {complete ? "Cot package: save $14 when you buy the cot, pad and cover together." : "Add the cot, pad and cover together to get the cot package saving of $14."}
      </p>
      <p className="mt-1 text-[13px] text-stone">Item prices come from the store; none are published on the current sleep systems page.</p>
    </div>
  );
}
