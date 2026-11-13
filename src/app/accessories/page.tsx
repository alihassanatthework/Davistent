import { CategoryChips, PageHeader, TalkToUs } from "@/components/layout";
import { Category } from "@/components/catalog/Category";
import { Pending, Section } from "@/components/ui";
import { outfitChips } from "@/content/chips";
import { getProducts } from "@/lib/commerce";
import { meta } from "@/lib/meta";

export const metadata = meta(
  "Wall Tent Accessories",
  "Frames, flys, floors, organizers, solar lights, stakes, patch kits and more for Davis canvas wall tents. Filter by your tent size.",
  "/accessories/",
);
export const revalidate = 600;

export default async function AccessoriesPage() {
  const list = (await getProducts()).filter((p) => ["frame", "accessory", "fly"].includes(p.category));
  return (
    <>
      <PageHeader
        title="Wall Tent Accessories"
        intro="Choose your tent size to see only what fits."
        crumbs={[
          { label: "Outfit", href: "/gear/" },
          { label: "Accessories", href: "/accessories/" },
        ]}
        accent="accessories"
        scene="wall"
      />
      <CategoryChips links={outfitChips} current="/accessories/" />
      <Section>
        <div className="mb-6">
          <Pending>About 21 accessories are listed today (organizers, solar LED lights, Hold Tight straps, waterproofing, Secure Stakes, tent cleaner and more). The remainder migrate from the store export.</Pending>
        </div>
        <Category products={list} filters={["compat", "price"]} />
      </Section>
      <TalkToUs />
    </>
  );
}
