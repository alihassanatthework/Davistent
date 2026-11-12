import { Category } from "@/components/catalog/Category";
import { CategoryChips, PageHeader, TalkToUs } from "@/components/layout";
import { Section } from "@/components/ui";
import { fact } from "@/content/facts";
import { getProducts } from "@/lib/commerce";
import { meta } from "@/lib/meta";
import { tentChips } from "@/content/chips";

export const metadata = meta(
  "Canvas Tents",
  "Every Davis canvas tent: wall tents from 10' × 15' to 16' × 25', hot-tent packages with stove, and specialty tents. Handcrafted in Denver since 1955.",
  "/tents/",
);
export const revalidate = 600;


export default async function TentsPage() {
  const all = (await getProducts()).filter((p) => ["wall", "package", "specialty"].includes(p.category));
  return (
    <>
      <PageHeader
        title="Canvas Tents"
        eyebrow={fact("origin")}
        intro={`${fact("cottonOnly")} Every tent is Sunforger®-treated cotton army duck with 5' walls, a stove jack and a sod cloth as standard. ${fact("modular")}`}
        crumbs={[{ label: "Tents", href: "/tents/" }]}
        accent="hunt"
        scene="wall"
      />
      <CategoryChips links={tentChips} current="/tents/" />
      <Section>
        <Category products={all} filters={["use", "sleeps", "size", "stove", "price"]} />
      </Section>
      <TalkToUs />
    </>
  );
}
