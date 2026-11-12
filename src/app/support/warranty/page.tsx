import { PageHeader, TalkToUs } from "@/components/layout";
import { Pending, Section } from "@/components/ui";
import { meta } from "@/lib/meta";

export const metadata = meta("Warranty", "Davis Tent warranty information.", "/support/warranty/");

export default function Page() {
  return (
    <>
      <PageHeader title="Warranty" crumbs={[{ label: "Support", href: "/support/faq/" }, { label: "Warranty", href: "/support/warranty/" }]} compact />
      <Section>
        <div className="max-w-2xl space-y-4">
          
          <Pending>Warranty terms for tents and stoves. Nothing is published here until confirmed must be supplied by Davis Tent.</Pending>
        </div>
      </Section>
      <TalkToUs />
    </>
  );
}
