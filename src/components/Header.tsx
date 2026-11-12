"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/content/site";
import { CartButton } from "./Cart";
import { Icon } from "./ui";
import { Search } from "./Search";
import { Logo } from "./Logo";

/**
 * Header (ch. 8): logo left; six primary items centre; search, account, cart and
 * phone right. Shrinks to 56 px on scroll down, returns on scroll up,
 * transparent over the homepage hero. Menus open on click or Enter, close on
 * Escape, and trap no focus (disclosure pattern).
 */
export function Header({ accountUrl }: { accountUrl: string }) {
  const path = usePathname();
  const isHome = path === "/";
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [sheet, setSheet] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 24);
      setCompact(y > 80);
      setHidden(y > last && y > 240 && !document.activeElement?.closest("header"));
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenIdx(null);
    setSheet(false);
    setSearchOpen(false);
  }, [path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openIdx !== null) {
        const btn = navRef.current?.querySelector<HTMLButtonElement>(`[data-idx="${openIdx}"]`);
        setOpenIdx(null);
        btn?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenIdx(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [openIdx]);

  useEffect(() => {
    const d = sheetRef.current;
    if (!d) return;
    if (sheet && !d.open) d.showModal();
    if (!sheet && d.open) {
      d.close();
      menuBtn.current?.focus();
    }
  }, [sheet]);

  const transparent = isHome && atTop && openIdx === null && !searchOpen;
  const h = compact ? "h-14" : "h-[72px]";

  return (
    <>
      <a href="#main" className="sr-only-focusable fixed left-4 top-2 z-[90] rounded-md bg-pine px-4 py-3 font-semibold text-bone">
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,height] duration-300 ease-out ${
          hidden ? "-translate-y-full" : ""
        } ${transparent ? "bg-transparent text-bone on-dark" : "border-b border-line bg-canvas/95 text-charcoal backdrop-blur"}`}
      >
        <div className={`container-site flex items-center gap-4 ${h} transition-[height] duration-300`}>
          <Link href="/" className="shrink-0" aria-label="Davis Tent home">
            <Logo className={compact ? "h-7" : "h-9"} />
          </Link>

          <nav ref={navRef} aria-label="Primary" className="ml-6 hidden flex-1 lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item, i) => {
                const current = path.startsWith(item.href.split("#")[0]) && item.href !== "/";
                const open = openIdx === i;
                return (
                  <li key={item.label} className="static">
                    <button
                      data-idx={i}
                      aria-expanded={open}
                      aria-controls={`mega-${i}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenIdx(open ? null : i);
                      }}
                      className={`flex h-11 items-center gap-1 rounded-md px-3 text-[15px] font-semibold hover:bg-black/5 ${
                        current ? "underline decoration-current decoration-2 underline-offset-8" : ""
                      } ${item.primary ? "" : "font-medium"}`}
                    >
                      {item.label}
                      <Icon name="chevron" className={`size-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
                    </button>
                    <div
                      id={`mega-${i}`}
                      hidden={!open}
                      className="absolute inset-x-0 top-full border-b border-line bg-canvas text-charcoal shadow-2"
                    >
                      <div className="container-site grid grid-cols-12 gap-6 py-8">
                        <div className="col-span-3">
                          <p className="eyebrow mb-2 text-stone-deep">{item.label}</p>
                          <p className="mb-4 font-display text-[22px] leading-7">{item.blurb}</p>
                          <Link href={item.href} className="inline-flex items-center gap-1 font-semibold text-pine hover:underline">
                            {item.label === "Guides" ? "All guides" : `Shop ${item.label.toLowerCase()}`} <Icon name="arrow" className="size-4" />
                          </Link>
                        </div>
                        {item.groups.map((g) => (
                          <div key={g.heading} className="col-span-2">
                            <p className="eyebrow mb-3 text-stone-deep">{g.heading}</p>
                            <ul className="space-y-1">
                              {g.links.map((l) => (
                                <li key={l.href}>
                                  <Link
                                    href={l.href}
                                    aria-current={path === l.href ? "page" : undefined}
                                    className="block py-1 text-[15px] hover:underline aria-[current=page]:font-semibold"
                                  >
                                    {l.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        {item.featured && (
                          <Link
                            href={item.featured.href}
                            className="col-span-3 col-start-10 rounded-md border border-line bg-snow p-4 hover:border-ink"
                          >
                            <p className="eyebrow mb-2 text-stone-deep">Featured</p>
                            <p className="font-semibold">{item.featured.label}</p>
                            <p className="data mt-1 text-stone">{item.featured.meta}</p>
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              aria-expanded={searchOpen}
              aria-controls="site-search"
              className="grid size-11 place-items-center rounded-md hover:bg-black/5"
            >
              <Icon name="search" />
              <span className="sr-only">Search</span>
            </button>
            <a href={accountUrl} className="hidden size-11 place-items-center rounded-md hover:bg-black/5 md:grid">
              <Icon name="user" />
              <span className="sr-only">My account</span>
            </a>
            <CartButton />
            <a
              href={`tel:${site.phone.tel}`}
              className="ml-2 hidden items-center gap-2 rounded-md px-3 py-2 text-[15px] font-semibold hover:bg-black/5 xl:flex"
            >
              <Icon name="phone" className="size-4" />
              <span className="data text-[15px]">{site.phone.display}</span>
            </a>
            <button
              ref={menuBtn}
              onClick={() => setSheet(true)}
              aria-haspopup="dialog"
              className="grid size-11 place-items-center rounded-md hover:bg-black/5 lg:hidden"
            >
              <Icon name="menu" />
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>
        {searchOpen && (
          <div id="site-search" className="border-t border-line bg-canvas text-charcoal">
            <div className="container-site py-4">
              <Search autoFocus onNavigate={() => setSearchOpen(false)} />
            </div>
          </div>
        )}
      </header>

      {/* Mobile sheet: full height, accordions, Call and Email at the bottom */}
      <dialog
        ref={sheetRef}
        aria-label="Menu"
        onClose={() => setSheet(false)}
        className="m-0 h-dvh max-h-dvh w-full max-w-full bg-canvas p-0 text-charcoal backdrop:bg-charcoal/40"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center justify-between border-b border-line px-4">
            <Logo className="h-7" />
            <button onClick={() => setSheet(false)} className="grid size-11 place-items-center rounded-md">
              <Icon name="close" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4">
            {nav.map((item) => (
              <details key={item.label} className="group border-b border-line">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-[19px] font-semibold">
                  {item.label}
                  <Icon name="chevron" className="size-5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="pb-4">
                  {item.groups.map((g) => (
                    <div key={g.heading} className="mb-3">
                      <p className="eyebrow mb-1 text-stone-deep">{g.heading}</p>
                      <ul>
                        {g.links.map((l) => (
                          <li key={l.href}>
                            <Link href={l.href} className="block py-2 text-[16px]" onClick={() => setSheet(false)}>
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            ))}
            <ul className="py-4">
              <li>
                <a href={accountUrl} className="block py-2">
                  My account
                </a>
              </li>
              <li>
                <Link href="/gift-certificates/" className="block py-2" onClick={() => setSheet(false)}>
                  Gift certificates
                </Link>
              </li>
            </ul>
          </nav>
          <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
            <a href={`tel:${site.phone.tel}`} className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-blaze text-ink font-semibold">
              <Icon name="phone" className="size-4" /> Call
            </a>
            <a href={`mailto:${site.email}`} className="flex min-h-12 items-center justify-center gap-2 rounded-md border-2 border-pine font-semibold text-pine">
              <Icon name="mail" className="size-4" /> Email
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
