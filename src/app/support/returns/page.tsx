import { PageHeader, TalkToUs } from "@/components/layout";
import { Checklist, Section } from "@/components/ui";
import { returnTerms } from "@/content/support";
import { meta } from "@/lib/meta";

export const metadata = meta("Return Policy", "Davis Tent returns: authorized returns within 30 days, 15–25% restock fee, new and unused condition. Custom orders are not returnable.", "/support/returns/");

export default function Returns() {
  return (
    <>
      <PageHeader title="Return Policy" crumbs={[{ label: "Support", href: "/support/faq/" }, { label: "Returns", href: "/support/returns/" }]} compact />
      <Section>
        <div className="max-w-2xl">
          <div className="rounded-md border border-line bg-snow p-5">
            <h2 className="text-[22px]">In short</h2>
            <p className="mt-2">Ask us first, within 30 days. Items must be new and unused. A restock fee applies. Custom orders cannot be returned.</p>
          </div>
          <h2 className="mb-4 mt-10 text-[28px]">Full terms</h2>
          <Checklist items={returnTerms} columns={1} />
        </div>
      </Section>
      <TalkToUs />
    </>
  );
}
