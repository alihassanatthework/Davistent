"use client";

import Link from "next/link";
import { useState } from "react";
import { modules } from "@/content/features";

/** Modular capabilities (homepage section 7): toggle chips add modules to a diagram. */
export function ModularDiagram() {
  const [on, setOn] = useState<Set<string>>(new Set(["fly"]));
  const toggle = (id: string) =>
    setOn((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
      <svg viewBox="0 0 480 300" className="w-full rounded-md border border-line bg-snow" role="img" aria-label={`Wall tent with ${[...on].join(", ") || "no add-ons"}`}>
        <g stroke="#1F3A2E" strokeWidth="2" fill="#FFFFFF" strokeLinejoin="round">
          {on.has("floor") && <rect x="150" y="230" width="210" height="14" fill="#C9B48A" stroke="none" opacity=".8" />}
          {/* main tent */}
          <path d="M150 240 V150 L255 90 L360 150 V240 Z" />
          <path d="M225 240 V185 Q255 172 285 185 V240" fill="none" />
          {on.has("fly") && <path d="M135 150 L255 76 L375 150" fill="none" stroke="#6B4F3A" strokeWidth="4" />}
          {on.has("awning") && <path d="M150 150 L95 190 M360 150 L415 190 M95 190 H415" fill="none" stroke="#5A5F3A" strokeWidth="3" />}
          {on.has("cook-shack") && (
            <g>
              <path d="M360 240 V175 L410 145 L460 175 V240 Z" />
              <path d="M360 200 h0" />
              <text x="410" y="225" fontSize="11" textAnchor="middle" fill="#1F3A2E" stroke="none">
                cook shack
              </text>
            </g>
          )}
        </g>
        <line x1="20" y1="244" x2="470" y2="244" stroke="#C9B48A" strokeWidth="3" />
      </svg>
      <div>
        <fieldset>
          <legend className="sr-only">Add-on modules</legend>
          <div className="flex flex-wrap gap-2">
            {modules.map((m) => (
              <label
                key={m.id}
                className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-sm border px-4 font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pine ${
                  on.has(m.id) ? "border-pine bg-pine text-bone" : "border-line bg-snow"
                }`}
              >
                <input type="checkbox" className="sr-only" checked={on.has(m.id)} onChange={() => toggle(m.id)} />
                {on.has(m.id) ? "✓ " : "+ "}
                {m.name}
              </label>
            ))}
          </div>
        </fieldset>
        <dl className="mt-6 space-y-3">
          {modules.map((m) => (
            <div key={m.id}>
              <dt className="font-semibold">
                <Link href={m.href} className="hover:underline">
                  {m.name}
                </Link>
              </dt>
              <dd className="text-[15px] text-stone-deep">{m.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
