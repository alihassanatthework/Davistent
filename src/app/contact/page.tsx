import { ContactForm } from "@/components/forms";
import { PageHeader } from "@/components/layout";
import { Icon, Pending, Section } from "@/components/ui";
import { site } from "@/content/site";
import { meta } from "@/lib/meta";

export const metadata = meta("Contact and Visit", "Call (877) 355-2267, email sales@davistent.com, or visit the Davis Tent shop in Denver, Colorado.", "/contact/");

export default async function Contact({ searchParams }: { searchParams: Promise<{ topic?: string; build?: string }> }) {
  const { topic, build } = await searchParams;
  const addr = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;
  return (
    <>
      <PageHeader title="Contact and Visit" crumbs={[{ label: "Contact", href: "/contact/" }]} compact />
      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <a href={`tel:${site.phone.tel}`} className="flex items-center gap-3 text-[22px] font-semibold"><Icon name="phone" /> {site.phone.display}</a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-3"><Icon name="mail" /> {site.email}</a>
            <div id="visit">
              <h2 className="text-[26px]">Visit the shop</h2>
              <p className="mt-2">{addr}</p>
              <p className="mt-2">Shop and showroom tours are offered. Call ahead to arrange a visit.</p>
              <a className="mt-2 inline-block text-pine underline" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`} rel="noopener">Get directions</a>
            </div>
            <Pending>Address confirmation and opening hours to be supplied by Davis Tent.</Pending>
          </div>
          <div className="lg:col-span-7">
            <h2 className="mb-4 text-[26px]">Send us a message</h2>
            <ContactForm topic={topic} build={build} />
          </div>
        </div>
      </Section>
    </>
  );
}
