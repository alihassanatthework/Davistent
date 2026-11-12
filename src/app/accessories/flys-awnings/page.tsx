import { CategoryChips, PageHeader, TalkToUs } from "@/components/layout";
import { Pending, Section, SectionHead } from "@/components/ui";
import { outfitChips } from "@/content/chips";
import { meta } from "@/lib/meta";
import Link from "next/link";

export const metadata = meta(
  "Tent Flys and Awnings",
  "Rain flys in 12 mil poly-coated nylon, 14 oz vinyl-coated ripstop or 10.10 oz Sunforger canvas, and integrated, detached or sewn-on awnings.",
  "/accessories/flys-awnings/",
);

const materials = [
  { id: "poly-fly", m: "12 mil polyethylene-coated nylon", use: "Light and economical; shorter trips", colours: "—" },
  { id: "vinyl-fly", m: "14 oz vinyl-coated ripstop nylon", use: "Heavy duty, long seasons", colours: "Tan or white" },
  { id: "canvas-fly", m: "10.10 oz Sunforger army duck canvas", use: "Breathes like the tent", colours: "Natural" },
];

export default function FlysPage() {
  return (
    <>
      <PageHeader
        title="Tent Flys and Awnings"
        intro="A fly is a second roof over the ridge for sun, rain and snow. An awning extends from the front wall to make a covered porch."
        crumbs={[
          { label: "Accessories", href: "/accessories/" },
          { label: "Flys and awnings", href: "/accessories/flys-awnings/" },
        ]}
        accent="flys"
      />
      <CategoryChips links={outfitChips} current="/accessories/flys-awnings/" />
      <Section labelledBy="h-mat">
        <SectionHead id="h-mat" eyebrow="Material comparison" title="Which fly material?" />
        <div role="region" aria-label="Fly materials" tabIndex={0} className="overflow-x-auto rounded-md border border-line bg-snow">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="p-3">Material</th>
                <th scope="col" className="p-3">Best for</th>
                <th scope="col" className="p-3">Colours</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((r) => (
                <tr key={r.id} id={r.id} className="border-b border-line last:border-0">
                  <th scope="row" className="p-3 font-semibold">{r.m}</th>
                  <td className="p-3">{r.use}</td>
                  <td className="p-3">{r.colours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="mt-10">Awnings</h3>
        <p className="mt-2">Integrated, detached or sewn on.</p>
        <p className="mt-6">
          Measuring your tent for a fly? Read <Link href="/journal/measuring-for-a-rain-fly/" className="text-pine underline">measuring for a rain fly</Link>.
        </p>
        <div className="mt-6">
          <Pending>No prices or sizes are published on the current flys page. Fly and awning products and prices come from the store export.</Pending>
        </div>
      </Section>
      <TalkToUs />
    </>
  );
}
