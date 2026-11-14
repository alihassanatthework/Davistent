import Link from "next/link";
import { type Product, formatPrice, priceLabel } from "@/content/catalog";
import { Badge, Icon } from "./ui";
import { TentIllustration } from "./TentIllustration";

/**
 * Product card (CR-15): white, 1 px border, 2 px radius, 4:3 image, condensed
 * capital title, one mono data line, bold price, text action. Hover and focus:
 * image 1.04 in 300 ms, border to Charcoal in 150 ms; no lift, shadow or tilt.
 * The whole card is one link with a visible 2 px Blaze focus ring.
 */
export function ProductCard({
  product: p,
  headingLevel: H = "h3",
  compareSlot,
}: {
  product: Product;
  headingLevel?: "h2" | "h3";
  compareSlot?: React.ReactNode;
}) {
  const points = [p.sizeLabel, p.sleeps ? `sleeps ${p.sleeps}` : undefined].filter(Boolean) as string[];
  return (
    <article className="group relative flex h-full flex-col rounded-md border border-line bg-snow transition-colors duration-(--motion-fast) ease-out hover:border-ink has-[:focus-visible]:border-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blaze">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-sm bg-canvas">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-(--motion-slow) ease-out group-hover:scale-[1.04] group-has-[:focus-visible]:scale-[1.04]"
          />
        ) : (
          <TentIllustration
            kind={p.illustration}
            className="h-full w-full p-4 transition-transform duration-(--motion-slow) ease-out group-hover:scale-[1.04] group-has-[:focus-visible]:scale-[1.04]"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {p.status === "sale" && <Badge tone="ember">On sale</Badge>}
          {p.status === "waitlist" && <Badge tone="stone">Waitlist</Badge>}
          {p.stoveIncluded && <Badge tone="pine">Stove included</Badge>}
          {["wall", "package", "specialty", "glamping"].includes(p.category) && <Badge>Made in Denver</Badge>}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <H className="font-display text-[16px] leading-[18px] font-semibold md:text-[18px] md:leading-5">
          <Link href={p.href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {p.name}
          </Link>
        </H>
        {points.length > 0 && <p className="data text-stone">{points.join("  ·  ")}</p>}
        <p className="line-clamp-2 text-[15px] leading-6 text-stone">{p.summary}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className={`data text-[17px] font-bold ${p.compareMin ? "text-blaze-deep md:text-[18px]" : "text-ink"}`}>
            {priceLabel(p)}
            {p.compareMin && (
              <span className="ml-2 text-[15px] font-normal text-slate line-through">
                <span className="sr-only">was </span>
                {formatPrice(p.compareMin)}
              </span>
            )}
          </p>
          {p.status === "lead-time" && <span className="text-[13px] text-stone">Built to order</span>}
          <span aria-hidden className="nav-label inline-flex items-center gap-1">
            View
            <Icon name="arrow" className="size-4 transition-transform duration-(--motion-fast) ease-out group-hover:translate-x-1" />
          </span>
        </div>
      </div>
      {compareSlot && <div className="relative z-10 border-t border-line px-4 py-2">{compareSlot}</div>}
    </article>
  );
}
