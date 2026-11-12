import Link from "next/link";
import { Category } from "@/components/catalog/Category";
import { SizeFinder } from "@/components/home/SizeFinder";
import { CategoryChips, PageHeader, TalkToUs } from "@/components/layout";
import { ButtonLink, Section, SectionHead } from "@/components/ui";
import { fact } from "@/content/facts";
import { getProducts } from "@/lib/commerce";
import { meta } from "@/lib/meta";
import { tentChips } from "@/content/chips";
import { PackageTable } from "./PackageTable";

export const metadata = meta(
  "Hunting Tents",
  "Canvas wall tents and hot-tent packages for hunting camp, from the Turkey 10' × 15' to the Bison 16' × 25'. Handcrafted in Denver, Colorado since 1955.",
  "/hunting/",
);
export const revalidate = 600;

export default async function HuntingPage() {
  const all = await getProducts();
  const list = all.filter((p) => ["wall", "package", "specialty"].includes(p.category) && p.uses?.some((u) => ["hunt", "spike", "solo", "cook"].includes(u)));
  return (
    <>
      <PageHeader
        title="Hunting Tents"
        eyebrow={fact("origin")}
        intro={<>Canvas wall tents known internationally for their great design and durability. {fact("hunters")}</>}
        crumbs={[{ label: "Hunt", href: "/hunting/" }]}
        accent="hunt"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/hunting/packages/">Packages with stove</ButtonLink>
          <ButtonLink href="/guides/season-dates/" variant="inverse">
            Season dates
          </ButtonLink>
        </div>
      </PageHeader>
      <CategoryChips links={tentChips} current="/hunting/" />
      <Section labelledBy="h-planner">
        <SectionHead id="h-planner" eyebrow="Camp planner" title="How big is your party?" />
        <SizeFinder />
      </Section>
      <Section tone="snow" labelledBy="h-pkgs">
        <SectionHead id="h-pkgs" eyebrow="Turkey to Bison" title="Compare hunt camp packages" />
        <PackageTable products={all.filter((p) => p.category === "package")} />
      </Section>
      <Section labelledBy="h-all">
        <SectionHead id="h-all" title="All hunting tents" />
        <Category products={list} filters={["use", "sleeps", "size", "stove", "price"]} />
        <p className="mt-8 text-[15px] text-stone-deep">
          {fact("customPricing")} <Link href="/build/" className="text-pine underline">Use the tent builder</Link>.
        </p>
      </Section>
      <TalkToUs />
    </>
  );
}
