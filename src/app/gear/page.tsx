import Link from "next/link";
import { CategoryChips, PageHeader, TalkToUs } from "@/components/layout";
import { Category } from "@/components/catalog/Category";
import { Section, SectionHead } from "@/components/ui";
import { outfitChips } from "@/content/chips";
import { getProducts } from "@/lib/commerce";
import { meta } from "@/lib/meta";

export const metadata = meta(
  "Camping & Packing Gear",
  "Pack saddles, panniers, cots, bedrolls and canvas bags, tested and proven for decades in the field.",
  "/gear/",
);
export const revalidate = 600;

const subs = [
  { href: "/gear/packing/", t: "Pack", d: "Panniers, pack saddles, scabbards and bedroll tarps" },
  { href: "/gear/sleep/", t: "Sleep", d: "Big Boy cot, cot pad, bag cover and cowboy bedroll" },
  { href: "/gear/carry/", t: "Carry", d: "Canvas gear, tent and stove bags" },
];

export default async function GearPage() {
  const list = (await getProducts()).filter((p) => ["packing", "sleep", "carry"].includes(p.category));
  return (
    <>
      <PageHeader title="Camping & Packing Gear" intro="Tested and proven for decades in the field." crumbs={[{ label: "Outfit", href: "/gear/" }]} accent="packing" />
      <CategoryChips links={outfitChips} current="/gear/" />
      <Section tone="snow" labelledBy="h-subs">
        <SectionHead id="h-subs" title="Three collections" />
        <ul className="grid gap-4 md:grid-cols-3">
          {subs.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="block h-full rounded-md border border-line p-6 hover:border-pine">
                <p className="font-display text-[28px]">{s.t}</p>
                <p className="mt-1 text-[15px] text-stone">{s.d}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section>
        <Category products={list} filters={["price"]} />
      </Section>
      <TalkToUs />
    </>
  );
}
