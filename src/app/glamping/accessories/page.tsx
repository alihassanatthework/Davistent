import { CategoryChips, PageHeader, TalkToUs } from "@/components/layout";
import { Category } from "@/components/catalog/Category";
import { Pending, Section } from "@/components/ui";
import { glampChips } from "@/content/chips";
import { getProducts } from "@/lib/commerce";
import { meta } from "@/lib/meta";

export const metadata = meta(
  "Glamping Accessories",
  "Accessories for Davis glamping tents: angle kits, stove jacks, flys and more. Davis Tent does not provide the furniture and decor.",
  "/glamping/accessories/",
);
export const revalidate = 600;

export default async function GlampAccessories() {
  const list = (await getProducts()).filter((p) => ["glamping-angle-kit", "wood-stove", "stove-jack", "fly-canvas"].includes(p.id));
  return (
    <>
      <PageHeader
        title="Glamping Accessories"
        intro="Davis Tent does not provide the furniture and decor. These are the parts that make the tent work."
        crumbs={[
          { label: "Glamp", href: "/glamping/" },
          { label: "Accessories", href: "/glamping/accessories/" },
        ]}
        accent="glamp"
        compact
      />
      <CategoryChips links={glampChips} current="/glamping/accessories/" />
      <Section>
        <div className="mb-6">
          <Pending>The current page links 14 items without prices. The full list and prices come from the store export.</Pending>
        </div>
        <Category products={list} compare={false} />
      </Section>
      <TalkToUs />
    </>
  );
}
