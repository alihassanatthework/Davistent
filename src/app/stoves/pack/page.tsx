import { PageHeader, TalkToUs } from "@/components/layout";
import { Pending, Section } from "@/components/ui";
import { meta } from "@/lib/meta";

export const metadata = meta("Pack Stoves", "Lightweight pack stoves for spike camps and horseback trips.", "/stoves/pack/");

export default function PackStoves() {
  return (
    <>
      <PageHeader title="Pack Stoves" crumbs={[{ label: "Stoves", href: "/stoves/" }, { label: "Pack stoves", href: "/stoves/pack/" }]} accent="stoves" scene="stove" compact />
      <Section>
        <Pending>The pack stove range (including the Ellis collapsible stove, 35 lb) migrates from /product-category/pack-stoves/ once the store export is available.</Pending>
      </Section>
      <TalkToUs />
    </>
  );
}
