import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { buttonClass, Icon, JsonLd } from "./ui";

export type Crumb = { label: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-[14px]">
        <ol className="flex flex-wrap items-center gap-1 opacity-85">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden>/</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className="font-semibold">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="hover:underline">
                  {c.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${site.url}${c.href}` })),
        }}
      />
    </>
  );
}

/**
 * Category header variants. CR-10: every category header is a flat Charcoal
 * band until its photograph is supplied (no illustration). The accent names are
 * kept so callers do not change; glamping routes get the lighter Olive variant (CR-25).
 */
const accents = {
  hunt: "bg-ink",
  specialty: "bg-ink",
  builder: "bg-ink",
  glamp: "bg-olive", // CR-25: glamping routes use Olive and Bone in place of Charcoal
  packing: "bg-ink",
  sleep: "bg-ink",
  accessories: "bg-ink",
  frames: "bg-ink",
  flys: "bg-ink",
  stoves: "bg-ink",
  deals: "bg-ink",
  plain: "bg-ink",
} as const;
export type Accent = keyof typeof accents;

/** Photo for a category header (CR-10). None supplied yet; see REDESIGN_AUDIT.md §7. */
export type HeaderImage = { src: string; alt: string };

/**
 * Category header (CR-10): breadcrumb, capital H1 in Bone and the existing
 * one-sentence introduction. 220 px tall on mobile, 320 px on desktop, so the
 * first products are visible on load. Static: no scroll-linked behaviour (CR-08).
 * With a photograph it gets a left scrim and one 400 ms reveal; without one it
 * is a flat Charcoal band.
 */
export function PageHeader({
  title,
  intro,
  crumbs,
  accent = "plain",
  image,
  eyebrow,
  children,
  compact,
}: {
  title: string;
  intro?: ReactNode;
  crumbs: Crumb[];
  accent?: Accent;
  image?: HeaderImage;
  eyebrow?: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <header data-surface="dark" className={`${accents[accent]} relative overflow-hidden pt-[var(--header-h)] text-bone`}>
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt={image.alt} className="reveal-image absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
          <div aria-hidden className="absolute inset-0 bg-linear-to-r from-ink/75 to-transparent" />
        </>
      )}
      <div className={`container-site relative flex flex-col justify-center ${compact ? "py-8" : "min-h-[220px] py-8 lg:min-h-[320px]"}`}>
        <div className="max-w-3xl">
          <Breadcrumbs items={crumbs} />
          {eyebrow && <p className="eyebrow mt-5 text-(--surface-eyebrow)">{eyebrow}</p>}
          <h1 className={eyebrow ? "mt-2" : "mt-5"}>{title}</h1>
          {intro && <div className="mt-3 max-w-2xl text-[17px] leading-[26px] opacity-90">{intro}</div>}
          {children && <div className="mt-5">{children}</div>}
        </div>
      </div>
    </header>
  );
}

export function CategoryChips({ links, current }: { links: Crumb[]; current: string }) {
  return (
    <nav aria-label="Related categories" className="border-b border-line bg-canvas">
      <ul className="container-site scrollbar-none flex gap-2 overflow-x-auto py-3">
        {links.map((l) => (
          <li key={l.href} className="shrink-0">
            <Link
              href={l.href}
              aria-current={l.href === current ? "page" : undefined}
              className="inline-flex min-h-10 items-center rounded-sm border border-line bg-snow px-4 text-[14px] font-semibold hover:border-pine aria-[current=page]:border-pine aria-[current=page]:bg-pine aria-[current=page]:text-bone"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Talk to us band (homepage section 16 and the end of most templates). */
export function TalkToUs({ title = "Talk to the people who sew your tent", line }: { title?: string; line?: string }) {
  return (
    <section aria-labelledby="talk" data-surface="accent" className="bg-blaze text-ink">
      <div className="container-site flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 id="talk">{title}</h2>
          <p className="mt-3 text-[17px] opacity-95">
            {line ?? "Questions on size, treatment or a custom build? Call us, or email "}
            {!line && (
              <a href={`mailto:${site.email}`} className="underline">
                {site.email}
              </a>
            )}
            {!line && ". For tents larger than 16' × 25', call for a quote."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={`tel:${site.phone.tel}`} className={buttonClass("secondary")}>
            <Icon name="phone" className="size-4" /> Call <span className="data text-[15px]">{site.phone.display}</span>
          </a>
          <Link href="/tents/" className={buttonClass("secondary")}>
            Shop all tents <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Sticky mobile action bar with Call and Shop (ch. 7, 17). */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-canvas p-2 md:hidden no-print">
      <a href={`tel:${site.phone.tel}`} className={buttonClass("secondary")}>
        <Icon name="phone" className="size-4" /> Call
      </a>
      <Link href="/tents/" className={buttonClass("secondary")}>
        Shop tents
      </Link>
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose-dt max-w-[68ch] space-y-4 text-[17px] leading-[27px] [&_h2]:mt-10 [&_h3]:mt-8 [&_a]:text-pine [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6">{children}</div>;
}
