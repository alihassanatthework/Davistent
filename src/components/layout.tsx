import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { Icon, JsonLd } from "./ui";
import { TentIllustration } from "./TentIllustration";
import type { Illustration } from "@/content/catalog";

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

const accents = {
  hunt: "bg-pine text-bone on-dark",
  specialty: "bg-surface-alt text-charcoal",
  builder: "bg-charcoal text-bone on-dark",
  glamp: "bg-canvas text-charcoal",
  packing: "bg-saddle text-bone on-dark",
  sleep: "bg-charcoal text-bone on-dark",
  accessories: "bg-pine text-bone on-dark",
  frames: "bg-stone-deep text-bone on-dark",
  flys: "bg-surface-alt text-charcoal",
  stoves: "bg-charcoal text-bone on-dark",
  deals: "bg-ink text-bone on-dark",
  plain: "bg-surface-alt text-charcoal",
} as const;
export type Accent = keyof typeof accents;

/**
 * Category header (ch. 13): H1 and one sentence over the category art. Static:
 * no scroll-linked behaviour anywhere (CR-08).
 */
export function PageHeader({
  title,
  intro,
  crumbs,
  accent = "plain",
  scene,
  eyebrow,
  children,
  compact,
}: {
  title: string;
  intro?: ReactNode;
  crumbs: Crumb[];
  accent?: Accent;
  scene?: Illustration;
  eyebrow?: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  const dark = accents[accent].includes("on-dark");
  return (
    <header className={`${accents[accent]} relative overflow-hidden pt-[var(--header-h)]`}>
      <div className={`container-site grid items-center gap-8 ${compact ? "py-10" : "min-h-[52vh] py-12 md:min-h-[60vh]"} lg:grid-cols-12`}>
        <div className="lg:col-span-7">
          <Breadcrumbs items={crumbs} />
          {eyebrow && <p className="eyebrow mt-6 opacity-85">{eyebrow}</p>}
          <h1 className={eyebrow ? "mt-2" : "mt-6"}>{title}</h1>
          {intro && <div className="mt-4 max-w-2xl text-[17px] leading-[27px] opacity-90">{intro}</div>}
          {children && <div className="mt-6">{children}</div>}
        </div>
        {scene && (
          <div className="hidden lg:col-span-5 lg:block" aria-hidden>
            <TentIllustration kind={scene} tone={dark ? "dark" : "light"} className="category-scene mx-auto w-full max-w-md" />
          </div>
        )}
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
          <a href={`tel:${site.phone.tel}`} className="inline-flex min-h-12 items-center gap-2 rounded-md bg-ink px-5 font-semibold text-bone hover:bg-gunmetal">
            <Icon name="phone" className="size-4" /> Call <span className="data text-[15px]">{site.phone.display}</span>
          </a>
          <Link href="/tents/" className="inline-flex min-h-12 items-center gap-2 rounded-md border-2 border-ink px-5 font-semibold hover:bg-ink hover:text-bone">
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
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-canvas/95 p-2 backdrop-blur md:hidden no-print">
      <a href={`tel:${site.phone.tel}`} className="flex min-h-12 items-center justify-center gap-2 rounded-md border-2 border-pine font-semibold text-pine">
        <Icon name="phone" className="size-4" /> Call
      </a>
      <Link href="/tents/" className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-blaze text-ink font-semibold">
        Shop tents
      </Link>
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose-dt max-w-[68ch] space-y-4 text-[17px] leading-[27px] [&_h2]:mt-10 [&_h3]:mt-8 [&_a]:text-pine [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6">{children}</div>;
}
