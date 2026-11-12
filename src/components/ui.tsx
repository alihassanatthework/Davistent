import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* ---------- Button (CR-19): primary · secondary · tertiary, one shared style ---------- */
type Variant = "primary" | "secondary" | "tertiary" | "inverse";
const base =
  "group nav-label inline-flex items-center justify-center gap-2 rounded-md px-6 min-h-12 transition-[color,background-color,border-color,transform] duration-(--motion-fast) ease-out active:translate-y-px active:duration-(--motion-instant) active:ease-linear disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0";
const variants: Record<Variant, string> = {
  /* Blaze fill, Charcoal label; hover Blaze Deep with a white label. One per viewport. */
  primary: "bg-blaze text-ink hover:bg-blaze-deep hover:text-white",
  /* 1.5 px outline in the surface text colour: Charcoal on light, Bone on dark */
  secondary: "border-[1.5px] border-(--surface-text) text-(--surface-text) hover:bg-(--surface-text) hover:text-(--surface-ground)",
  /* Capital text with an arrow */
  tertiary: "px-0 min-h-11 text-current underline-offset-4 hover:underline",
  /* 1.5 px Bone outline on dark */
  inverse: "border-[1.5px] border-bone text-bone hover:bg-bone hover:text-ink",
};
/** Heights: 48 px default, 52 px in the hero, 56 px on the buy button. */
type Size = "default" | "hero" | "buy";
const sizes: Record<Size, string> = { default: "", hero: "min-h-[52px]", buy: "min-h-14 w-full" };

/** Class list for elements that must stay plain anchors (tel:, mailto:, external). */
export const buttonClass = (variant: Variant = "primary", size: Size = "default") => `${base} ${variants[variant]} ${sizes[size]}`;

/** Arrow shifts 4 px on hover and focus. */
const Arrow = () => <Icon name="arrow" className="size-4 transition-transform duration-(--motion-fast) ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1" />;

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  arrow,
  size = "default",
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; arrow?: boolean; size?: Size }) {
  return (
    <Link className={`${buttonClass(variant, size)} ${className}`} {...rest}>
      {children}
      {(arrow || variant === "tertiary") && <Arrow />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  loading,
  size = "default",
  children,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; loading?: boolean; size?: Size }) {
  return (
    <button className={`${buttonClass(variant, size)} ${className}`} aria-busy={loading || undefined} {...rest}>
      {children}
      {loading && <span className="sr-only">Working…</span>}
    </button>
  );
}

/* ---------- Icons: 1.5 px stroke on a 24 px grid ---------- */
const paths: Record<string, ReactNode> = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2.4 11h10.2L20 8H6.2" />
      <circle cx="9" cy="19.5" r="1.25" />
      <circle cx="17" cy="19.5" r="1.25" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4M12 17v.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  play: <path d="M8 5v14l11-7L8 5Z" />,
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
  flame: <path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5 1 1.5 1.5 2 2 2 0-3-1-4 1-7Z" />,
  snow: <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5" />,
  ruler: (
    <>
      <rect x="2" y="8" width="20" height="8" rx="1" />
      <path d="M6 8v3M10 8v4M14 8v3M18 8v4" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" />
    </>
  ),
  compare: <path d="M8 4v16M16 4v16M4 8h4M16 16h4M4 16h4M16 8h4" />,
};

export function Icon({ name, className = "size-5", title }: { name: keyof typeof paths | string; className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      {paths[name] ?? null}
    </svg>
  );
}

/* ---------- Section, eyebrow, headings ---------- */
export function Section({
  id,
  tone = "canvas",
  className = "",
  children,
  labelledBy,
}: {
  id?: string;
  tone?: "canvas" | "pine" | "charcoal" | "forest" | "gunmetal" | "olive" | "snow" | "alt" | "ember";
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  const tones = {
    canvas: "bg-canvas text-charcoal",
    pine: "bg-pine text-bone on-dark",
    charcoal: "bg-charcoal text-bone on-dark",
    forest: "bg-forest text-bone on-dark",
    gunmetal: "bg-gunmetal text-bone on-dark",
    olive: "bg-olive text-bone on-dark",
    snow: "bg-snow text-charcoal",
    alt: "bg-surface-alt text-charcoal",
    ember: "bg-blaze text-ink",
  };
  return (
    <section id={id} aria-labelledby={labelledBy} data-surface={tone === "ember" ? "accent" : tones[tone].includes("on-dark") ? "dark" : "light"} className={`section-y ${tones[tone]} ${className}`}>
      <div className="container-site">{children}</div>
    </section>
  );
}

export function SectionHead({
  id,
  eyebrow,
  title,
  intro,
  action,
  as: H = "h2",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  action?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3 text-(--surface-eyebrow)">{eyebrow}</p>}
        <H id={id}>{title}</H>
        {intro && <div className="mt-4 text-[17px] leading-[27px] opacity-90">{intro}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ---------- Badge and tag: text, never colour alone ---------- */
export function Badge({ tone = "duck", children }: { tone?: "duck" | "ember" | "pine" | "gold" | "stone"; children: ReactNode }) {
  const tones = {
    duck: "bg-duck/40 text-charcoal",
    ember: "bg-blaze-deep text-white",
    pine: "bg-pine text-bone",
    gold: "bg-olive text-bone",
    stone: "bg-surface-alt text-stone-deep",
  };
  return <span className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[12px] font-semibold ${tones[tone]}`}>{children}</span>;
}

/* ---------- Notice: confirmation-needed and rule messages ---------- */
export function Notice({
  tone = "info",
  title,
  children,
  role,
}: {
  tone?: "info" | "warn" | "block" | "pending";
  title?: string;
  children: ReactNode;
  role?: "alert" | "status";
}) {
  const tones = {
    info: "border-l-ink bg-snow",
    warn: "border-l-warning bg-snow",
    block: "border-l-error bg-snow",
    pending: "border-dashed border-l-slate bg-surface-alt",
  };
  const icon = tone === "info" ? "info" : tone === "pending" ? "info" : "alert";
  return (
    <div role={role} className={`flex gap-3 rounded-md border border-l-4 border-line p-4 text-[15px] leading-6 text-charcoal ${tones[tone]}`}>
      <Icon name={icon} className="mt-0.5 size-5 shrink-0" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

/** Shown wherever the roadmap says client content is required before launch. */
export function Pending({ children }: { children: ReactNode }) {
  return (
    <Notice tone="pending" title="Awaiting confirmation from Davis Tent">
      {children}
    </Notice>
  );
}

/* ---------- Spec table: real table; label/value list below 480 px ---------- */
export function SpecTable({ rows, caption }: { rows: { label: string; value: string }[]; caption: string }) {
  return (
    <div role="region" aria-label={caption} tabIndex={0} className="overflow-x-auto rounded-md border border-line bg-snow">
      <table className="w-full text-left text-[15px]">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-line last:border-0 max-sm:flex max-sm:flex-col">
              <th scope="row" className="w-2/5 px-4 py-3 align-top font-semibold max-sm:w-full max-sm:pb-0">
                {r.label}
              </th>
              <td className="data px-4 py-3 text-charcoal">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Checklist ---------- */
export function Checklist({ items, columns = 2 }: { items: readonly string[]; columns?: 1 | 2 | 3 }) {
  const cols = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3" };
  return (
    <ul className={`grid gap-x-8 gap-y-2 ${cols[columns]}`}>
      {items.map((i) => (
        <li key={i} className="flex gap-2 text-[15px] leading-6">
          <Icon name="check" className="mt-0.5 size-5 shrink-0 text-success" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- JSON-LD ---------- */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
