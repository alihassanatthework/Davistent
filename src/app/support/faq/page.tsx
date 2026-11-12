import { PageHeader, TalkToUs } from "@/components/layout";
import { Accordion } from "@/components/primitives";
import { JsonLd, Section } from "@/components/ui";
import { faqs } from "@/content/support";
import { meta } from "@/lib/meta";

export const metadata = meta("Frequently Asked Questions", "Answers about Davis wall tents, camp stoves, custom sizes, repairs, shipping and visiting our Denver shop.", "/support/faq/");

export default function FaqPage() {
  const groups = [...new Set(faqs.map((f) => f.group))];
  return (
    <>
      <PageHeader title="Frequently Asked Questions" crumbs={[{ label: "Support", href: "/support/faq/" }, { label: "FAQ", href: "/support/faq/" }]} compact />
      <Section>
        <div className="max-w-3xl space-y-10">
          {groups.map((g) => (
            <div key={g}>
              <h2 className="mb-4 text-[28px]">{g}</h2>
              <Accordion idPrefix={g} items={faqs.map((f, i) => ({ f, i })).filter(({ f }) => f.group === g).map(({ f, i }) => ({ id: `q-${i}`, title: f.q, content: <p>{f.a}</p> }))} />
            </div>
          ))}
        </div>
      </Section>
      <TalkToUs title="Still stuck?" line="Call or email us. The people who answer sew the tents." />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
    </>
  );
}
