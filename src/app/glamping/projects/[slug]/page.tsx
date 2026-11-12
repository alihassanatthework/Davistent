import { notFound } from "next/navigation";
import { PageHeader, TalkToUs } from "@/components/layout";
import { ButtonLink, Checklist, Pending, Section } from "@/components/ui";
import { caseStudies } from "@/content/support";
import { meta } from "@/lib/meta";

export const dynamicParams = false;
export const generateStaticParams = () => caseStudies.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = caseStudies.find((x) => x.slug === slug);
  return c ? meta(`${c.name} Glamping Project`, c.summary, `/glamping/projects/${c.slug}/`) : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = caseStudies.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <>
      <PageHeader
        title={c.name}
        eyebrow="Glamping project"
        intro={c.summary}
        crumbs={[
          { label: "Glamp", href: "/glamping/" },
          { label: "Projects", href: `/glamping/projects/${c.slug}/` },
          { label: c.name, href: `/glamping/projects/${c.slug}/` },
        ]}
        accent="glamp"
        compact
      />
      <Section tone="snow">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {c.read ? (
              <p>
                {c.name} sits on {c.location}. Each Davis glamping tent is fitted out as a full guest suite. The 16-image gallery migrates from the current page.
              </p>
            ) : (
              <Pending>This case study was not read in the audit. Its text and gallery migrate from the current site in Phase 9.</Pending>
            )}
          </div>
          <aside className="rounded-md border border-line bg-canvas p-5">
            <h2 className="text-[22px]">Facts</h2>
            <dl className="mt-3 space-y-2 text-[15px]">
              <div>
                <dt className="font-semibold">Location</dt>
                <dd>{c.location}</dd>
              </div>
            </dl>
            {c.facts.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold">Amenities</p>
                <Checklist items={c.facts} columns={1} />
              </div>
            )}
            <p className="mt-4 text-[13px] text-stone">Tent count and models to be supplied by Davis Tent.</p>
          </aside>
        </div>
        <ButtonLink href="/glamping/for-business/resorts/#enquire" className="mt-8">
          Plan a similar project
        </ButtonLink>
      </Section>
      <TalkToUs />
    </>
  );
}
