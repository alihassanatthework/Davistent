import { notFound } from "next/navigation";
import { CategoryChips, PageHeader, TalkToUs } from "@/components/layout";
import { Category } from "@/components/catalog/Category";
import { Pending, Section } from "@/components/ui";
import type { Category as Cat } from "@/content/catalog";
import { outfitChips } from "@/content/chips";
import { getProducts } from "@/lib/commerce";
import { meta } from "@/lib/meta";
import { BundleBuilder } from "./BundleBuilder";

const subs = {
  packing: {
    cat: "packing" as Cat,
    title: "Packing Gear",
    intro: "Function over form: pack saddles, panniers and horse packing gear built to carry camp into the backcountry.",
    accent: "packing" as const,
  },
  sleep: {
    cat: "sleep" as Cat,
    title: "Camp Sleep Systems",
    intro: "The Big Boy cot is 7' in length by 2' 6\" in width and sits 18\" above the ground. Add a high-density foam pad, a 10 oz canvas bag cover and a cowboy bedroll.",
    accent: "sleep" as const,
  },
  carry: { cat: "carry" as Cat, title: "Bags and Carry", intro: "Canvas bags for tents, stoves, poles and gear.", accent: "packing" as const },
};
type Sub = keyof typeof subs;

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(subs).map((sub) => ({ sub }));
export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ sub: string }> }) {
  const s = subs[(await params).sub as Sub];
  return s ? meta(s.title, s.intro, `/gear/${(await params).sub}/`) : {};
}

export default async function GearSub({ params }: { params: Promise<{ sub: string }> }) {
  const key = (await params).sub as Sub;
  const s = subs[key];
  if (!s) notFound();
  const list = (await getProducts()).filter((p) => p.category === s.cat);
  return (
    <>
      <PageHeader
        title={s.title}
        intro={s.intro}
        crumbs={[
          { label: "Outfit", href: "/gear/" },
          { label: s.title, href: `/gear/${key}/` },
        ]}
        accent={s.accent}
      />
      <CategoryChips links={outfitChips} current={`/gear/${key}/`} />
      <Section>
        {key === "packing" && (
          <div className="mb-6">
            <Pending>19 packing products are in the store; the remaining items (mantie tarp, lash cinch, saddle bags, feed bag, hobbles, pommel bag, boot stirrups, meat bags) migrate from the product export. Two items are on waitlist.</Pending>
          </div>
        )}
        {key === "sleep" && (
          <div className="mb-10">
            <BundleBuilder />
          </div>
        )}
        <Category products={list} filters={["price"]} />
      </Section>
      <TalkToUs />
    </>
  );
}
