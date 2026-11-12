import { Suspense } from "react";
import { PageHeader, TalkToUs } from "@/components/layout";
import { TentBuilder } from "@/components/builder/TentBuilder";
import { fact } from "@/content/facts";
import { meta } from "@/lib/meta";

export const metadata = meta(
  "Custom Tent Builder",
  "Build a custom Davis canvas wall tent step by step: size, treatment, openings, frame, floor and fly, with live price and shipping rules.",
  "/build/",
);

export default function BuildPage() {
  return (
    <>
      <PageHeader
        title="Custom Tent Builder"
        eyebrow="Built to order in Denver"
        intro={<>Six steps, with the price always visible. {fact("leadTime")}</>}
        crumbs={[
          { label: "Hunt", href: "/hunting/" },
          { label: "Custom tent builder", href: "/build/" },
        ]}
        accent="builder"
        scene="frame"
        compact
      />
      <section className="section-y bg-canvas">
        <div className="container-site">
          <Suspense fallback={<p>Loading the builder…</p>}>
            <TentBuilder />
          </Suspense>
        </div>
      </section>
      <TalkToUs line="Building something unusual? Tents larger than 16' × 25' are quoted by phone using our per-square-foot rates." />
    </>
  );
}
