import { PageHeader, TalkToUs } from "@/components/layout";
import { Pending, Section } from "@/components/ui";
import { fact } from "@/content/facts";
import { meta } from "@/lib/meta";

export const metadata = meta("Shipping", "Davis Tent shipping information.", "/support/shipping/");

export default function Page() {
  return (
    <>
      <PageHeader title="Shipping" crumbs={[{ label: "Support", href: "/support/faq/" }, { label: "Shipping", href: "/support/shipping/" }]} compact />
      <Section>
        <div className="max-w-2xl space-y-4">
          <p>{fact("fireShipping")}</p><p>Frames can ship as angles only to save freight.</p>
          <Pending>General shipping terms, carriers and timescales must be supplied by Davis Tent.</Pending>
        </div>
      </Section>
      <TalkToUs />
    </>
  );
}
