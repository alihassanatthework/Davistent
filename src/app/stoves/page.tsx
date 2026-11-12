import { PageHeader, TalkToUs } from "@/components/layout";
import { Category } from "@/components/catalog/Category";
import { Section, SectionHead } from "@/components/ui";
import { getProducts } from "@/lib/commerce";
import { meta } from "@/lib/meta";
import { StoveSizer } from "./StoveSizer";

export const metadata = meta(
  "Wood-Burning Camp Stoves",
  "Davis wood-burning camp stoves in Valley, Ridge and Peak sizes, plus pipe, jacks, mats and parts. Find the stove that fits your tent.",
  "/stoves/",
);
export const revalidate = 600;

export default async function StovesPage() {
  const all = await getProducts();
  return (
    <>
      <PageHeader
        title="Wood-Burning Camp Stoves"
        intro={"10-gauge steel top and door, 12-gauge cold-rolled steel body. Every stove needs a 5.5\" or larger stove jack."}
        crumbs={[{ label: "Stoves", href: "/stoves/" }]}
        accent="stoves"
        scene="stove"
      />
      <Section tone="snow" id="sizing" labelledBy="h-size">
        <SectionHead id="h-size" eyebrow="Stove sizing tool" title="Which stove fits my tent?" />
        <StoveSizer />
      </Section>
      <Section labelledBy="h-stoves">
        <SectionHead id="h-stoves" title="Stoves" intro="The category also names a Summit series and an Ellis collapsible stove (35 lb); those listings are confirmed against the store export before launch." />
        <Category products={all.filter((p) => p.category === "stove")} compare />
      </Section>
      <Section tone="snow" id="parts" labelledBy="h-parts">
        <SectionHead id="h-parts" title="Pipe and parts" />
        <Category products={all.filter((p) => p.category === "stove-part")} filters={["price"]} compare={false} />
      </Section>
      <TalkToUs />
    </>
  );
}
