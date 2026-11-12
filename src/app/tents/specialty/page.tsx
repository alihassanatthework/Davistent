import { Category } from "@/components/catalog/Category";
import { CategoryChips, PageHeader, TalkToUs } from "@/components/layout";
import { Section } from "@/components/ui";
import { fact } from "@/content/facts";
import { getProducts } from "@/lib/commerce";
import { meta } from "@/lib/meta";
import { tentChips } from "@/content/chips";

export const metadata = meta(
  "Specialty Tents",
  "Go Tent, Herder spike tent, Single Shot, Cook Shack, Royal Throne shower tent, Single Pole Tent and The Shed. Canvas tents for every job in camp.",
  "/tents/specialty/",
);
export const revalidate = 600;

export default async function SpecialtyPage() {
  const list = (await getProducts()).filter((p) => p.category === "specialty");
  return (
    <>
      <PageHeader
        title="Specialty Tents"
        eyebrow={fact("origin")}
        intro="Smaller canvas tents for solo hunts, spike camps, cooking, washing and storage. Filter by the job you need done."
        crumbs={[
          { label: "Tents", href: "/tents/" },
          { label: "Specialty", href: "/tents/specialty/" },
        ]}
        accent="specialty"
      />
      <CategoryChips links={tentChips} current="/tents/specialty/" />
      <Section>
        <Category products={list} filters={["use", "sleeps", "price"]} />
      </Section>
      <TalkToUs />
    </>
  );
}
