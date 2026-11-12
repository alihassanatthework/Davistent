import Link from "next/link";
import { type Product, formatPrice, priceLabel } from "@/content/catalog";
import { Badge } from "./ui";
import { TentIllustration } from "./TentIllustration";

/**
 * Product card (ch. 16): 4:3 image, title, two data points, price, one action.
 * Hairline border, no shadow at rest. The whole card is one link.
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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md border border-line bg-snow transition-colors duration-(--motion-fast) hover:border-ink focus-within:border-ink">
      <div className="relative aspect-[4/3] overflow-hidden bg-canvas">
        <TentIllustration
          kind={p.illustration}
          className="h-full w-full p-4 transition-transform duration-(--motion-slow) ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {p.status === "sale" && <Badge tone="ember">On sale</Badge>}
          {p.status === "waitlist" && <Badge tone="stone">Waitlist</Badge>}
          {p.stoveIncluded && <Badge tone="pine">Stove included</Badge>}
          {["wall", "package", "specialty", "glamping"].includes(p.category) && <Badge>Made in Denver</Badge>}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <H className="font-sans text-[19px] font-semibold leading-6">
          <Link href={p.href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {p.name}
          </Link>
        </H>
        {points.length > 0 && <p className="data text-stone">{points.join("  ·  ")}</p>}
        <p className="line-clamp-2 text-[15px] leading-6 text-stone">{p.summary}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="data text-[16px] font-semibold text-charcoal">
            {priceLabel(p)}
            {p.compareMin && (
              <span className="ml-2 font-normal text-stone line-through">
                <span className="sr-only">was </span>
                {formatPrice(p.compareMin)}
              </span>
            )}
          </p>
          {p.status === "lead-time" && <span className="text-[13px] text-stone">Built to order</span>}
        </div>
      </div>
      {compareSlot && <div className="relative z-10 border-t border-line px-4 py-2">{compareSlot}</div>}
    </article>
  );
}
