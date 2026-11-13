import Link from "next/link";
import { CategoryChips, PageHeader, TalkToUs } from "@/components/layout";
import { ProductCard } from "@/components/ProductCard";
import { ButtonLink, Checklist, Section, SectionHead } from "@/components/ui";
import { formatPrice } from "@/content/catalog";
import { glampChips } from "@/content/chips";
import { fact } from "@/content/facts";
import { caseStudies } from "@/content/support";
import { getProducts } from "@/lib/commerce";
import { meta } from "@/lib/meta";

export const metadata = meta(
  "Luxury Glamping Tents",
  "Safari-style canvas glamping tents built in Denver: The Cozy Hideaway, The Oasis Retreat and The Summit Ridge, or custom sizes for resorts and campgrounds.",
  "/glamping/",
);
export const revalidate = 600;

export default async function GlampingPage() {
  const models = (await getProducts()).filter((p) => p.category === "glamping");
  return (
    <>
      <PageHeader
        title="Luxury Glamping Tents"
        eyebrow={fact("origin")}
        intro="Canvas safari tents with a UV-rated fly and a 7' covered patio, sized for your own land or a whole property."
        crumbs={[{ label: "Glamp", href: "/glamping/" }]}
        accent="glamp"
        scene="glamp"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#models">See the three models</ButtonLink>
          <ButtonLink href="/glamping/for-business/resorts/" variant="secondary">
            Plan a project
          </ButtonLink>
        </div>
      </PageHeader>
      <CategoryChips links={glampChips} current="/glamping/" />

      <Section id="models" labelledBy="h-models">
        <SectionHead id="h-models" eyebrow="Model selector" title="Three sizes, one standard of canvas" />
        <ul className="grid gap-6 md:grid-cols-3">
          {models.map((m) => (
            <li key={m.id}>
              <ProductCard product={m} headingLevel="h3" />
              <p className="data mt-2 text-[13px] text-stone">
                {m.size![0] * m.size![1]} sq ft floor · {formatPrice(m.priceMin)}–{formatPrice(m.priceMax!)}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[15px] text-stone-deep">
          Need another size? We can manufacture a glamping tent customized to the specific size you need. <Link href="/glamping/custom/" className="text-pine underline">Custom glamping tents</Link>.
        </p>
      </Section>

      <Section tone="snow" labelledBy="h-incl">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHead id="h-incl" eyebrow="Included" title="What comes with every glamping tent" />
            <Checklist items={models[0].included!} />
          </div>
          <div className="space-y-4">
            <h3>Options</h3>
            <p>Clear plastic windows and a stove jack.</p>
            <h3>Not included</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>This package does not include frame poles.</li>
              <li>{fact("noFurniture")}</li>
              <li>Davis Tent doesn’t build decks, but partners with a deck builder.</li>
            </ul>
            <h3>Treatments</h3>
            <p>Standard treated canvas, Sunforger All Pro (mildew + sun) or Sunforger Sun Pro (extreme UV). Sun Pro is white only; the others are white or Autumn Gold.</p>
          </div>
        </div>
      </Section>

      <Section tone="alt" id="gallery" labelledBy="h-b2b">
        <SectionHead
          id="h-b2b"
          eyebrow="For business"
          title="Refining our safari tent glamping systems for almost two decades"
          intro="Dozens of luxury properties internationally, plus logistics work for national brands."
          action={<ButtonLink href="/glamping/for-business/resorts/">Plan a project</ButtonLink>}
        />
        <ul className="grid gap-4 md:grid-cols-3">
          {caseStudies.map((c) => (
            <li key={c.slug}>
              <Link href={`/glamping/projects/${c.slug}/`} className="block h-full rounded-md border border-line bg-snow p-5 hover:border-pine">
                <p className="font-display text-[22px]">{c.name}</p>
                <p className="mt-1 text-[14px] text-stone">{c.location}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[14px] text-stone-deep">The current glamping galleries (about 32 images) migrate here with captions once the image audit is complete.</p>
      </Section>
      <TalkToUs title="Planning glamping units?" line="Call us to talk sizes, treatments and lead times for one tent or a dozen." />
    </>
  );
}
