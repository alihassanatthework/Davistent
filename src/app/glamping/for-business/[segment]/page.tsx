import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/forms";
import { PageHeader, TalkToUs } from "@/components/layout";
import { Icon, Section, SectionHead } from "@/components/ui";
import { fact } from "@/content/facts";
import { type Segment, businessSegments, caseStudies } from "@/content/support";
import { meta } from "@/lib/meta";
import { SiteEstimator } from "./SiteEstimator";

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(businessSegments).map((segment) => ({ segment }));

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }) {
  const s = businessSegments[(await params).segment as Segment];
  return s ? meta(s.title, `${s.promise} Canvas glamping tents handcrafted in Denver, with project enquiry and lead times.`, `/glamping/for-business/${(await params).segment}/`) : {};
}

const segLabel: Record<Segment, string> = { resorts: "Resort", campgrounds: "Campground", "rv-resorts": "RV resort" };

export default async function BusinessPage({ params }: { params: Promise<{ segment: string }> }) {
  const key = (await params).segment as Segment;
  const s = businessSegments[key];
  if (!s) notFound();
  return (
    <>
      <PageHeader
        title={s.title}
        eyebrow="Glamping for business"
        intro={s.promise}
        crumbs={[
          { label: "Glamp", href: "/glamping/" },
          { label: "For business", href: `/glamping/for-business/${key}/` },
        ]}
        accent="glamp"
      >
        <nav aria-label="Business segments" className="flex flex-wrap gap-2">
          {(Object.keys(businessSegments) as Segment[]).map((k) => (
            <Link
              key={k}
              href={`/glamping/for-business/${k}/`}
              aria-current={k === key ? "page" : undefined}
              className="inline-flex min-h-10 items-center rounded-sm border border-edge px-4 text-[14px] font-semibold text-bone hover:border-bone aria-[current=page]:border-bone aria-[current=page]:bg-bone aria-[current=page]:text-ink"
            >
              {segLabel[k]}s
            </Link>
          ))}
        </nav>
      </PageHeader>
      <Section tone="snow" labelledBy="h-proof">
        <SectionHead id="h-proof" eyebrow="Proof" title="Why properties choose Davis" />
        <ul className="grid gap-4 md:grid-cols-3">
          {s.proof.map((p) => (
            <li key={p} className="flex gap-3 rounded-md border border-line p-5">
              <Icon name="check" className="mt-0.5 size-5 shrink-0 text-success" />
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[14px] text-stone-deep">{fact("noFurniture")} Brand logos appear here once permission is confirmed.</p>
      </Section>
      <Section labelledBy="h-process">
        <SectionHead id="h-process" eyebrow="Process" title="From enquiry to opening weekend" />
        <ol className="grid gap-4 md:grid-cols-4">
          {["Tell us about the property", "We recommend sizes and treatments", "Deck plans with our deck-builder partner", "Tents built in Denver and shipped"].map((t, i) => (
            <li key={t} className="rounded-md border border-line bg-snow p-5">
              <p className="data text-olive">0{i + 1}</p>
              <p className="mt-1 font-semibold">{t}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[14px] text-stone-deep">Lead times and volume terms to be supplied by Davis Tent.</p>
      </Section>
      <Section tone="alt" labelledBy="h-est">
        <SectionHead id="h-est" eyebrow="Site-count estimator" title="Rough budget for your units" />
        <SiteEstimator />
      </Section>
      <Section tone="snow" id="enquire" labelledBy="h-form">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead id="h-form" eyebrow="Plan a project" title="Tell us about your property" />
            <p>We reply with sizing, treatments and lead times. Prefer to talk? Call (877) 355-2267.</p>
            <ul className="mt-6 space-y-2">
              {caseStudies.map((c) => (
                <li key={c.slug}>
                  <Link className="text-pine underline" href={`/glamping/projects/${c.slug}/`}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-8">
            <EnquiryForm segment={segLabel[key]} />
          </div>
        </div>
      </Section>
      <TalkToUs />
    </>
  );
}
