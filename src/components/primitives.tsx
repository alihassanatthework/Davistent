"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./ui";

/** Section reveal: CSS transition triggered by IntersectionObserver, once per element. */
export function Reveal({ children, className = "", index = 0, as: Tag = "div" }: { children: ReactNode; className?: string; index?: number; as?: "div" | "li" }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setIn(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} className={`reveal ${inView ? "is-in" : ""} ${className}`} style={{ "--i": index } as React.CSSProperties}>
      {children}
    </Tag>
  );
}

/** Accordion: button with aria-expanded; heading level set per use. */
export function Accordion({
  items,
  level = 3,
  multiple = true,
  idPrefix = "acc",
}: {
  items: { id?: string; title: string; content: ReactNode }[];
  level?: 2 | 3 | 4;
  multiple?: boolean;
  idPrefix?: string;
}) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const H = `h${level}` as "h3";
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const i = items.findIndex((it) => it.id === hash);
    if (i >= 0) setOpen(new Set([i]));
  }, [items]);
  return (
    <div className="divide-y divide-line rounded-md border border-line bg-snow">
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div key={it.title} id={it.id}>
            <H className="m-0 font-sans text-[17px] font-semibold">
              <button
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-${i}`}
                onClick={() =>
                  setOpen((prev) => {
                    const n = multiple ? new Set(prev) : new Set<number>();
                    if (prev.has(i)) n.delete(i);
                    else n.add(i);
                    return n;
                  })
                }
                className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left"
              >
                {it.title}
                <Icon name={isOpen ? "minus" : "plus"} className="size-5 shrink-0" />
              </button>
            </H>
            <div id={`${idPrefix}-${i}`} hidden={!isOpen} className="px-4 pb-4 text-[16px] leading-[25px]">
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Swipe rail with CSS scroll-snap plus previous and next buttons. */
export function Rail({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return (
    <div role="region" aria-label={label} className="relative">
      <div ref={ref} className="rail pb-2" tabIndex={0}>
        {children}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={() => step(-1)} className="grid size-11 place-items-center rounded-md border border-line bg-snow text-charcoal hover:border-pine">
          <Icon name="arrow" className="size-5 rotate-180" />
          <span className="sr-only">Previous</span>
        </button>
        <button onClick={() => step(1)} className="grid size-11 place-items-center rounded-md border border-line bg-snow text-charcoal hover:border-pine">
          <Icon name="arrow" className="size-5" />
          <span className="sr-only">Next</span>
        </button>
      </div>
    </div>
  );
}

/** YouTube lite embed: loads the player only on click. */
export function LiteYouTube({ id, title }: { id: string; title: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-charcoal">
      {on ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button onClick={() => setOn(true)} className="group absolute inset-0 grid place-items-center text-snow">
          <span className="grid size-16 place-items-center rounded-full bg-ember-deep transition-transform group-hover:scale-105">
            <Icon name="play" className="size-7 translate-x-0.5" />
          </span>
          <span className="absolute inset-x-0 bottom-0 p-4 text-left font-semibold">
            <span className="sr-only">Play video: </span>
            {title}
          </span>
        </button>
      )}
    </div>
  );
}
