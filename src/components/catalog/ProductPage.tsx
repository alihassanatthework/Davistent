import Link from "next/link";
import { type Product, compatibleWith, products, priceLabel, stoveFor } from "@/content/catalog";
import { fact, facts } from "@/content/facts";
import { faqs } from "@/content/support";
import { site } from "@/content/site";
import { Breadcrumbs, type Crumb, TalkToUs } from "../layout";
import { FeatureHotspots } from "../home/FeatureHotspots";
import { FloorPlan } from "../home/SizeFinder";
import { Accordion } from "../primitives";
import { ProductCard } from "../ProductCard";
import { TentIllustration } from "../TentIllustration";
import { Badge, ButtonLink, Checklist, JsonLd, Notice, Section, SpecTable } from "../ui";
import { BuyBox } from "./BuyBox";
import { PoleToggle } from "./PoleToggle";

/** One template family for tents, packages, stoves, gear and accessories (ch. 14). */
export function ProductPage({ product: p, crumbs }: { product: Product; crumbs: Crumb[] }) {
  const isTent = ["wall", "package", "specialty", "glamping"].includes(p.category);
  const sizeKey = p.size ? `${p.size[0]}x${p.size[1]}` : undefined;
  const addons = sizeKey ? compatibleWith(sizeKey).slice(0, 4) : [];
  const nearby = p.category === "wall" || p.category === "package" ? products.filter((x) => x.category === p.category) : [];
  const idx = nearby.findIndex((x) => x.id === p.id);
  const neighbours = idx >= 0 ? [nearby[idx - 1], p, nearby[idx + 1]].filter(Boolean) : [];
  const stove = p.size ? stoveFor(p.size[0] * p.size[1]) : null;
  const questions = faqs.filter((f) => (isTent ? f.group === "Wall tents" : p.category === "stove" ? f.group === "Camp stoves" : false)).slice(0, 4);

  const sections = [
    p.included && { title: "What is included", content: <Checklist items={p.included} /> },
    p.specs && { title: "Specifications", content: <SpecTable rows={p.specs} caption={`${p.name} specifications`} /> },
    isTent && {
      title: "Setup and care",
      content: (
        <div className="space-y-3">
          {p.id === "wall-14x15" && <p>A 14' × 15' frame needs 17 sticks of 1" EMT in 10' lengths. Order angles only and buy EMT locally to save freight.</p>}
          {p.id === "go-tent" && <p>The Go Tent frame needs 9 sticks of EMT. Internal frames are not compatible with sewn-in floors.</p>}
          <p>{fact("drying")} Clean with mild soap and a soft brush. A hard container is recommended for storage.</p>
          <p>
            <Link href="/guides/videos/#setup">Setup videos</Link> · <Link href="/support/faq/">Frequently asked questions</Link>
          </p>
        </div>
      ),
    },
  ].filter(Boolean) as { title: string; content: React.ReactNode }[];

  return (
    <>
      <div className="pt-[var(--header-h)]">
        <div className="container-site py-6">
          <Breadcrumbs items={crumbs} />
        </div>
        <div className="container-site grid gap-10 pb-12 lg:grid-cols-12 [&>*]:min-w-0">
          {/* gallery */}
          <div className="lg:col-span-7">
            <div className="rail !grid-cols-none !auto-cols-[100%] rounded-md" role="region" aria-label="Product images" tabIndex={0}>
              <figure className="aspect-[4/3] rounded-md border border-line bg-snow">
                <TentIllustration kind={p.illustration} className="h-full w-full p-6" label={`${p.name} illustration`} />
              </figure>
              {p.size && isTent && (
                <figure className="grid aspect-[4/3] place-items-center rounded-md border border-line bg-snow p-6">
                  <FloorPlan w={p.size[0]} l={p.size[1]} cots={p.sleepsMax ?? 2} stove eating={false} />
                </figure>
              )}
            </div>
            <p className="mt-2 text-[13px] text-stone">Drawings shown until product photography from four fixed angles is shot. Swipe for the floor plan.</p>
          </div>

          {/* title and options */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="flex flex-wrap gap-2">
                {isTent && <Badge>Handcrafted in Denver</Badge>}
                {p.status === "sale" && <Badge tone="ember">On sale</Badge>}
                {p.stoveIncluded && <Badge tone="pine">Stove included</Badge>}
              </div>
              <h1 className="mt-3 text-[30px] leading-8 md:text-[36px] md:leading-10">{p.name}</h1>
              {(p.sizeLabel || p.sleeps) && (
                <p className="data mt-2 text-stone-deep">{[p.sizeLabel, p.sleeps && `sleeps ${p.sleeps}`, stove && isTent && `${stove.name} stove`].filter(Boolean).join("  ·  ")}</p>
              )}
              <p className="mt-4 text-[17px] leading-7">{p.summary}</p>
              {p.needsConfirmation && (
                <div className="mt-4">
                  <Notice tone="pending" title="Data to confirm before launch">
                    {p.needsConfirmation}
                  </Notice>
                </div>
              )}
              <div className="mt-6">
                <BuyBox product={p} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {sections.length > 0 && (
        <Section tone="snow">
          <div className="space-y-10">
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-10">
              {sections.map((s) => (
                <div key={s.title}>
                  <h2 className="mb-4 text-[28px]">{s.title}</h2>
                  {s.content}
                </div>
              ))}
            </div>
            <div className="lg:hidden">
              <Accordion items={sections} level={2} idPrefix="pdp" />
            </div>
            {p.id === "go-tent" && (
              <div>
                <h2 className="mb-4 text-[28px]">Pole system</h2>
                <PoleToggle />
              </div>
            )}
          </div>
        </Section>
      )}

      {/* One Charcoal band for the origin statement, on the products where it already appears (CR-16) */}
      {isTent && facts.origin.status === "verified" && (
        <Section tone="charcoal" labelledBy="h-origin">
          <div className="max-w-3xl">
            <h2 id="h-origin">Where it’s made</h2>
            <p className="mt-4 text-[17px] leading-[26px]">
              {fact("origin")}. {fact("sunforgerButler")}
            </p>
            <p className="mt-3 text-[15px] text-ash">{fact("madeInUsa")}</p>
          </div>
        </Section>
      )}

      {(p.category === "wall" || p.category === "package") && (
        <Section labelledBy="h-anatomy">
          <h2 id="h-anatomy" className="mb-8">
            Anatomy of a Davis wall tent
          </h2>
          <FeatureHotspots />
        </Section>
      )}

      {addons.length > 0 && (
        <Section tone="snow" labelledBy="h-addons">
          <h2 id="h-addons" className="mb-8">
            Fits this tent
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {addons.map((a) => (
              <li key={a.id}>
                <ProductCard product={a} />
              </li>
            ))}
          </ul>
          <ButtonLink href={`/accessories/?compat=${sizeKey}`} variant="tertiary" className="mt-6">
            All accessories that fit a {p.sizeLabel}
          </ButtonLink>
        </Section>
      )}

      {neighbours.length > 1 && (
        <Section labelledBy="h-compare">
          <h2 id="h-compare" className="mb-6">
            Compare with nearby sizes
          </h2>
          <div role="region" aria-label="Nearby sizes" tabIndex={0} className="overflow-x-auto rounded-md border border-line bg-snow">
            <table className="w-full min-w-[520px] text-left text-[15px]">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="p-3" />
                  {neighbours.map((n) => (
                    <th key={n.id} scope="col" className="p-3">
                      {n.id === p.id ? (
                        <span>
                          {n.sizeLabel} <span className="text-ash">(this tent)</span>
                        </span>
                      ) : (
                        <Link href={n.href} className="text-pine underline">
                          {n.sizeLabel}
                        </Link>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Sleeps", (n: Product) => n.sleeps ?? "—"],
                  ["Floor area", (n: Product) => (n.size ? `${n.size[0] * n.size[1]} sq ft` : "—")],
                  ["Price", (n: Product) => priceLabel(n)],
                  ["Stove", (n: Product) => (n.size ? stoveFor(n.size[0] * n.size[1]).name : "—")],
                ].map(([label, get]) => (
                  <tr key={label as string} className="border-b border-line last:border-0">
                    <th scope="row" className="p-3 font-semibold">
                      {label as string}
                    </th>
                    {neighbours.map((n) => (
                      <td key={n.id} className="data p-3">
                        {(get as (n: Product) => string)(n)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      <Section tone="snow" labelledBy="h-reviews">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 id="h-reviews">Reviews</h2>
            <p className="mt-3">
              On-site reviews for this product are migrated from the store. Davis Tent is rated {site.googleRating.value} on Google.
            </p>
            <ButtonLink href="/reviews/" variant="tertiary" className="mt-4">
              All reviews
            </ButtonLink>
          </div>
          {questions.length > 0 && (
            <div>
              <h2 className="mb-4">Questions</h2>
              <Accordion items={questions.map((q) => ({ title: q.q, content: <p>{q.a}</p> }))} idPrefix="pq" />
            </div>
          )}
        </div>
      </Section>

      <TalkToUs />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.summary,
          brand: { "@type": "Brand", name: "Davis Tent" },
          url: `${site.url}${p.href}`,
          ...(p.priceMin > 0 && {
            offers: {
              "@type": p.priceMax && p.priceMax !== p.priceMin ? "AggregateOffer" : "Offer",
              priceCurrency: "USD",
              ...(p.priceMax && p.priceMax !== p.priceMin ? { lowPrice: p.priceMin, highPrice: p.priceMax } : { price: p.priceMin }),
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
    </>
  );
}
