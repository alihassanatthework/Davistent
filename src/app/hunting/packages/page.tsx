import { Category } from "@/components/catalog/Category";
import { CategoryChips, PageHeader, TalkToUs } from "@/components/layout";
import { Checklist, Section, SectionHead } from "@/components/ui";
import { getProducts } from "@/lib/commerce";
import { meta } from "@/lib/meta";
import { tentChips } from "@/content/chips";
import { PackageTable } from "../PackageTable";

export const metadata = meta(
  "Hunting Tent Packages with Stove",
  "Hot tents: a canvas wall tent with a wood-burning stove, angle kit, floor and bags. Turkey, Antelope, Elk, Elk Plus, Grizzly and Bison packages.",
  "/hunting/packages/",
);
export const revalidate = 600;

export default async function PackagesPage() {
  const list = (await getProducts()).filter((p) => p.category === "package");
  return (
    <>
      <PageHeader
        title="Hunting Tent Packages with Stove"
        eyebrow="Hot Tents: Canvas Wall Tent + Wood Burning Stove"
        intro="Six packages, each with a stove sized to the tent. Everything you need to pitch camp except the frame poles you cut or buy locally."
        crumbs={[
          { label: "Hunt", href: "/hunting/" },
          { label: "Packages with stove", href: "/hunting/packages/" },
        ]}
        accent="hunt"
        scene="package"
      />
      <CategoryChips links={tentChips} current="/hunting/packages/" />
      <Section tone="snow" labelledBy="h-cmp">
        <SectionHead id="h-cmp" title="Side-by-side" />
        <PackageTable products={list} />
      </Section>
      <Section labelledBy="h-box">
        <SectionHead id="h-box" eyebrow="What is in the box" title="Included in every package" />
        <Checklist items={list[0].included!} columns={3} />
      </Section>
      <Section tone="snow">
        <Category products={list} filters={["sleeps", "price"]} />
      </Section>
      <TalkToUs />
    </>
  );
}
