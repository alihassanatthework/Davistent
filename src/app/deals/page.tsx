import { CategoryChips, PageHeader, TalkToUs } from "@/components/layout";
import { Category } from "@/components/catalog/Category";
import { Pending, Section } from "@/components/ui";
import { outfitChips } from "@/content/chips";
import { getProducts } from "@/lib/commerce";
import { meta } from "@/lib/meta";

export const metadata = meta("Deals and Steals", "Sale items, clearance items and factory seconds, including scratch and dent canvas tents.", "/deals/");
export const revalidate = 600;

export default async function DealsPage() {
  const list = (await getProducts()).filter((p) => p.category === "deal" || p.status === "sale");
  return (
    <>
      <PageHeader title="Deals and Steals" intro="Sale items, clearance items and factory seconds." crumbs={[{ label: "Outfit", href: "/gear/" }, { label: "Deals", href: "/deals/" }]} accent="deals" />
      <CategoryChips links={outfitChips} current="/deals/" />
      <Section>
        <div className="mb-6">
          <Pending>Terms for deal and scratch-and-dent items, and the condition note on each, to be supplied by Davis Tent.</Pending>
        </div>
        <Category products={list} filters={["price"]} />
      </Section>
      <TalkToUs />
    </>
  );
}
