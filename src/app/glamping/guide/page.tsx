import Link from "next/link";
import { PageHeader, Prose, TalkToUs } from "@/components/layout";
import { TentIllustration } from "@/components/TentIllustration";
import { Section } from "@/components/ui";
import { fact } from "@/content/facts";
import { meta } from "@/lib/meta";

export const metadata = meta(
  "What Is a Glamping Tent?",
  "What makes a Davis glamping tent: cotton canvas, Sunforger treatments, an elevated fly, decks, interior upgrades, winter glamping and sizes.",
  "/glamping/guide/",
);

const anatomy = [
  ["Rain fly", "UV-rated, acrylic-coated, elevated over the roof to shed sun and rain."],
  ["Awning", "Creates a 7' covered patio in front of the door."],
  ["Doors", "A taller door with Vislon zippers, an oversized removable screen door and a Colorado door."],
  ["Windows", "Three screen windows; clear plastic windows as an option."],
  ["Canvas", "Standard treated, Sunforger All Pro (mildew + sun) or Sunforger Sun Pro (extreme UV)."],
  ["Deck", "Not included. Davis partners with a deck builder."],
];

export default function GlampGuide() {
  return (
    <>
      <PageHeader
        title="What Is a Glamping Tent?"
        eyebrow="Glamping guide"
        intro="A glamping tent is a canvas wall tent built for guests: taller doors, a fly lifted off the roof, a covered patio and fabrics chosen for months in the sun."
        crumbs={[
          { label: "Glamp", href: "/glamping/" },
          { label: "Guide", href: "/glamping/guide/" },
        ]}
        accent="glamp"
        compact
      />
      <Section tone="snow" labelledBy="h-anat">
        <h2 id="h-anat" className="mb-8">
          Anatomy of a Davis glamping tent
        </h2>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <TentIllustration kind="glamp" className="w-full rounded-md bg-canvas p-6" label="Labelled glamping tent drawing" />
          <dl className="grid gap-4 sm:grid-cols-2">
            {anatomy.map(([t, d], i) => (
              <div key={t} className="rounded-md border border-line p-4">
                <dt className="font-semibold">
                  <span className="data mr-2 text-olive">{i + 1}</span>
                  {t}
                </dt>
                <dd className="mt-1 text-[15px]">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
      <Section>
        <Prose>
          <h2>Fabric and treatment</h2>
          <p>
            {fact("cottonOnly")} Sunforger has been the leader in the fabric treatment industry for more than 50 years. {fact("sunforgerButler")}
          </p>
          <h2>Condensation</h2>
          <p>Cotton breathes. {fact("condensation")}</p>
          <h2>Winter glamping</h2>
          <p>
            Add a stove jack and a Davis wood stove for cold-season guests. See the <Link href="/stoves/">stove sizing tool</Link>.
          </p>
          <h2>Sizes</h2>
          <p>
            The Cozy Hideaway 14' × 15', The Oasis Retreat 16' × 20' and The Summit Ridge 16' × 25', or a <Link href="/glamping/custom/">custom size</Link>.
          </p>
        </Prose>
      </Section>
      <TalkToUs />
    </>
  );
}
