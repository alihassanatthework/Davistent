"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { buildIndex, query, type SearchDoc } from "@/lib/search";
import { Icon } from "./ui";

/**
 * Header search, combobox pattern (ch. 16). Instant results grouped as
 * Products, Guides and Questions; tolerant of typos; understands "14x15".
 */
export function Search({ autoFocus, onNavigate }: { autoFocus?: boolean; onNavigate?: () => void }) {
  const index = useMemo(buildIndex, []);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const router = useRouter();
  const id = useId();
  const results = useMemo(() => query(index, q, 10), [index, q]);
  const groups = (["Products", "Guides", "Questions"] as const)
    .map((t) => ({ t, items: results.filter((r) => r.type === t) }))
    .filter((g) => g.items.length);
  const flat: SearchDoc[] = groups.flatMap((g) => g.items);

  const go = (href: string) => {
    onNavigate?.();
    router.push(href);
  };

  return (
    <form
      role="search"
      action="/search/"
      onSubmit={(e) => {
        if (active >= 0 && flat[active]) {
          e.preventDefault();
          go(flat[active].href);
        }
      }}
      className="relative"
    >
      <label htmlFor={`${id}-q`} className="sr-only">
        Search tents, gear and guides
      </label>
      <div className="flex items-center gap-2 rounded-md border border-line bg-snow px-3 focus-within:border-pine">
        <Icon name="search" className="size-5 text-stone" />
        <input
          id={`${id}-q`}
          name="q"
          type="search"
          autoFocus={autoFocus}
          autoComplete="off"
          role="combobox"
          aria-expanded={q.length > 0}
          aria-controls={`${id}-list`}
          aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
          placeholder="Search: try 14x15, Elk package, stove jack"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(-1);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(flat.length - 1, a + 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(-1, a - 1));
            }
          }}
          className="h-12 flex-1 bg-transparent text-[16px] outline-none"
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {q ? `${flat.length} results` : ""}
      </p>
      {q && (
        <div id={`${id}-list`} role="listbox" className="mt-2 max-h-[60vh] overflow-y-auto rounded-md border border-line bg-snow shadow-2">
          {flat.length === 0 ? (
            <p className="p-4 text-stone">
              No results for “{q}”. Try a tent size like 14x15, or{" "}
              <a href="/contact/" className="text-pine underline">
                ask us
              </a>
              .
            </p>
          ) : (
            groups.map((g) => (
              <div key={g.t} role="group" aria-label={g.t}>
                <p className="eyebrow px-4 pb-1 pt-3 text-stone-deep">{g.t}</p>
                {g.items.map((r) => {
                  const i = flat.indexOf(r);
                  return (
                    <div
                      key={r.id}
                      id={`${id}-opt-${i}`}
                      role="option"
                      aria-selected={i === active}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        go(r.href);
                      }}
                      className={`flex cursor-pointer items-baseline justify-between gap-4 px-4 py-2 ${i === active ? "bg-canvas" : "hover:bg-canvas"}`}
                    >
                      <span className="font-medium">{r.title}</span>
                      {r.meta && <span className="data shrink-0 text-stone">{r.meta}</span>}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </form>
  );
}
