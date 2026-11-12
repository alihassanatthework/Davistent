import { PageHeader, TalkToUs } from "@/components/layout";
import { Category } from "@/components/catalog/Category";
import { Pending, Section } from "@/components/ui";
import { getProducts } from "@/lib/commerce";
import { meta } from "@/lib/meta";

export const metadata = meta("Tent Organizers", "Organizers and storage for Davis canvas wall tents.", "/accessories/organizers/");
export const revalidate = 600;

export default async function Organizers() {
  const list = (await getProducts()).filter((p) => ["cot-organizer", "storage-loft"].includes(p.id));
  return (
    <>
      <PageHeader title="Tent Organizers" crumbs={[{ label: "Accessories", href: "/accessories/" }, { label: "Organizers", href: "/accessories/organizers/" }]} accent="accessories" compact />
      <Section>
        <div className="mb-6">
          <Pending>The organizer range migrates from the store category /product-category/tent-organizers/.</Pending>
        </div>
        <Category products={list} compare={false} />
      </Section>
      <TalkToUs />
    </>
  );
}
