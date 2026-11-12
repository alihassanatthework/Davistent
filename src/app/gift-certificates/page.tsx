import { PageHeader, TalkToUs } from "@/components/layout";
import { Pending, Section } from "@/components/ui";
import { meta } from "@/lib/meta";
import { GiftForm } from "./GiftForm";

export const metadata = meta("Gift Certificates", "Davis Tent online gift certificates from $50 to $2,500, delivered now or on a date you choose, assigned as store credit.", "/gift-certificates/");

export default function GiftPage() {
  return (
    <>
      <PageHeader title="Gift Certificates" intro="Assigned as store credit. Delivered now or on a date you choose." crumbs={[{ label: "Gift certificates", href: "/gift-certificates/" }]} accent="plain" compact />
      <Section tone="snow">
        <div className="grid gap-10 lg:grid-cols-2">
          <GiftForm />
          <div className="space-y-4">
            <h2 className="text-[26px]">Terms summary</h2>
            <p>Gift certificates are assigned as store credit and redeemed at checkout.</p>
            <Pending>Full gift certificate terms (expiry, refunds, partial use) to be supplied by Davis Tent. Purchase is handled by the existing store plugin.</Pending>
          </div>
        </div>
      </Section>
      <TalkToUs />
    </>
  );
}
