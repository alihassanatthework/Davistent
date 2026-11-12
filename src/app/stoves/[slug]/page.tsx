import { notFound } from "next/navigation";
import { ProductPage } from "@/components/catalog/ProductPage";
import { Notice, Section } from "@/components/ui";
import { products } from "@/content/catalog";
import { meta } from "@/lib/meta";

const stoveItems = products.filter((p) => p.category === "stove" || p.category === "stove-part");
export const dynamicParams = false;
export const generateStaticParams = () => stoveItems.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = stoveItems.find((x) => x.slug === slug);
  return p ? meta(p.name, p.summary, p.href) : {};
}

export default async function StovePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = stoveItems.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <>
      <ProductPage product={p} crumbs={[{ label: "Stoves", href: "/stoves/" }, { label: p.name, href: p.href }]} />
      {p.category === "stove" && (
        <Section tone="alt" labelledBy="h-safety">
          <h2 id="h-safety" className="mb-4">
            Safety and setup
          </h2>
          <div className="max-w-2xl space-y-4">
            <p>Be sure to pre-burn your stove prior to placing it in your tent.</p>
            <p>Every Davis stove needs a 5.5" or larger stove jack. The standard jack location is inside left as you enter.</p>
            <Notice tone="pending" title="Awaiting confirmation from Davis Tent">
              Stove clearances to canvas, and warranty terms, to be supplied by Davis Tent. The current page says “Guaranteed!” and its meta description mentions a lifetime warranty; no warranty is published until confirmed.
            </Notice>
          </div>
        </Section>
      )}
    </>
  );
}
