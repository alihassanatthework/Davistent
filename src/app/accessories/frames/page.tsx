import { CategoryChips, PageHeader, TalkToUs } from "@/components/layout";
import { Category } from "@/components/catalog/Category";
import { Section, SectionHead } from "@/components/ui";
import { outfitChips } from "@/content/chips";
import { getProducts } from "@/lib/commerce";
import { meta } from "@/lib/meta";
import { FrameChooser } from "./FrameChooser";

export const metadata = meta(
  "Tent Frames and Poles",
  "Internal frames, angle kits and traditional galvanized pole systems for Davis wall tents. Order angles only with a cut list for local 1\" EMT.",
  "/accessories/frames/",
);
export const revalidate = 600;

export default async function FramesPage() {
  const list = (await getProducts()).filter((p) => p.category === "frame");
  return (
    <>
      <PageHeader
        title="Tent Frames and Poles"
        intro="Frames are not included with tents. Choose an internal frame, a traditional pole system, or an angle kit and cut list for EMT you buy locally."
        crumbs={[
          { label: "Accessories", href: "/accessories/" },
          { label: "Frames and poles", href: "/accessories/frames/" },
        ]}
        accent="frames"
      />
      <CategoryChips links={outfitChips} current="/accessories/frames/" />
      <Section tone="snow" labelledBy="h-choose">
        <SectionHead id="h-choose" eyebrow="Frame chooser" title="Internal frame or traditional poles?" />
        <FrameChooser />
      </Section>
      <Section id="internal">
        <Category products={list} filters={["compat", "price"]} />
      </Section>
      <TalkToUs />
    </>
  );
}
