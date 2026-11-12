import { EnquiryForm } from "@/components/forms";
import { PageHeader, TalkToUs } from "@/components/layout";
import { Section, SectionHead } from "@/components/ui";
import { meta } from "@/lib/meta";

export const metadata = meta(
  "Custom Glamping Tents",
  "Davis Tent can manufacture a glamping tent customized to the specific size you need. A four-step process from enquiry to delivery.",
  "/glamping/custom/",
);

export default function CustomGlamping() {
  return (
    <>
      <PageHeader
        title="Custom Glamping Tents"
        eyebrow="Built to your size"
        intro="We can manufacture a glamping tent customized to the specific size you need."
        crumbs={[
          { label: "Glamp", href: "/glamping/" },
          { label: "Custom", href: "/glamping/custom/" },
        ]}
        accent="glamp"
        compact
      />
      <Section tone="snow" labelledBy="h-steps">
        <SectionHead id="h-steps" eyebrow="Four steps" title="How a custom glamping tent is made" />
        <ol className="grid gap-4 md:grid-cols-4">
          {["Send us the size and use", "We confirm canvas, treatment and options", "Approve the quote and drawing", "We build it in Denver"].map((t, i) => (
            <li key={t} className="rounded-md border border-line p-5">
              <p className="data text-olive">0{i + 1}</p>
              <p className="mt-1 font-semibold">{t}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section labelledBy="h-enq">
        <SectionHead id="h-enq" title="Start a custom enquiry" />
        <EnquiryForm segment="Private land" />
      </Section>
      <TalkToUs />
    </>
  );
}
