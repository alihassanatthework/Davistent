import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { CampCards } from "@/components/home/CampCards";
import { SizeFinder } from "@/components/home/SizeFinder";
import { FeatureHotspots } from "@/components/home/FeatureHotspots";
import { ModularDiagram } from "@/components/home/ModularDiagram";
import { ProductCard } from "@/components/ProductCard";
import { TentIllustration } from "@/components/TentIllustration";
import { Rail, Reveal } from "@/components/primitives";
import { TalkToUs } from "@/components/layout";
import { SignupForm } from "@/components/SignupForm";
import { ButtonLink, Icon, Section, SectionHead } from "@/components/ui";
import { byCategory, bySlug, formatPrice, stoveFits } from "@/content/catalog";
import { fact } from "@/content/facts";
import { caseStudies, conservationPartners, journalPosts, videoCategories } from "@/content/support";
import { site } from "@/content/site";
import { getProducts } from "@/lib/commerce";

export const revalidate = 600;

/** Homepage: sixteen sections, each with one job, no repeats (ch. 9). */
export default async function Home() {
  const live = await getProducts();
  const find = (id: string) => live.find((p) => p.id === id)!;
  const popular = [find("pkg-elk"), find("wall-14x15"), find("cozy-hideaway"), find("go-tent")];
  const specialty = byCategory("specialty");
  const stove = bySlug("stove", "wood-burning-camp-stove")!;

  return (
    <>
      {/* 1 Hero: one photograph, one statement, one action (CR-07) */}
      <Hero />

      {/* 2 Shop by camp */}
      <Section id="shop-by-camp" labelledBy="h-camp">
        <SectionHead id="h-camp" eyebrow="Shop by camp" title="Where are you headed?" />
        <CampCards />
      </Section>

      {/* 3 Most popular */}
      <Section tone="snow" labelledBy="h-popular">
        <SectionHead
          id="h-popular"
          eyebrow="Most popular"
          title="The tents our customers choose most"
          action={<ButtonLink href="/tents/" variant="tertiary">All tents</ButtonLink>}
        />
        <Rail label="Most popular tents">
          {popular.map((p, i) => (
            <Reveal key={p.id} index={i} className="h-full">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </Rail>
      </Section>

      {/* 4 Size finder */}
      <Section labelledBy="h-size">
        <SectionHead
          id="h-size"
          eyebrow="Size finder"
          title="What size tent do I need?"
          intro="Tell us who is sleeping in camp. We allow for a stove and an eating area, because that is how a hunting camp is actually used."
        />
        <SizeFinder />
      </Section>

      {/* 5 The canvas */}
      <Section tone="charcoal" labelledBy="h-canvas">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-3 opacity-80">The canvas</p>
            <h2 id="h-canvas">The fabric is the argument</h2>
            <p className="mt-4 text-[17px] leading-7 opacity-90">{fact("cottonOnly")}</p>
            <ul className="mt-8 space-y-6">
              {[
                { t: fact("canvasWeight"), d: `${fact("longFiber")}. ${fact("tearStrength")}` },
                { t: fact("sunforgerUs"), d: fact("sunforgerButler") },
                { t: fact("resistance"), d: fact("lifetime") },
              ].map((f, i) => (
                <Reveal as="li" key={f.t} index={i} className="border-l-2 border-tan pl-4">
                  <p className="font-display text-[22px] font-semibold leading-7">{f.t}</p>
                  <p className="mt-1 text-[15px] leading-6 opacity-85">{f.d}</p>
                </Reveal>
              ))}
            </ul>
            <ButtonLink href="/guides/canvas/" variant="inverse" className="mt-8" arrow>
              Read the canvas guide
            </ButtonLink>
          </div>
          {/* Photo slot: canvas macro (CR-22, needed from client). Flat placeholder, no texture. */}
          <div aria-hidden className="aspect-square bg-gunmetal" />
        </div>
      </Section>

      {/* 6 Standard features */}
      <Section labelledBy="h-features">
        <SectionHead
          id="h-features"
          eyebrow="Standard features"
          title="Included on every wall tent"
          action={<ButtonLink href="/guides/standard-features/" variant="tertiary">See all standard features</ButtonLink>}
        />
        <FeatureHotspots />
      </Section>

      {/* 7 Modular + 8 Hot tents */}
      <Section tone="snow" labelledBy="h-modular">
        <SectionHead id="h-modular" eyebrow="Modular" title="Add on as your camp grows" intro={fact("modular")} />
        <ModularDiagram />
      </Section>

      <Section tone="pine" labelledBy="h-hot">
        <SectionHead
          id="h-hot"
          eyebrow="Hot tents and stoves"
          title="Hot Tents: Canvas Wall Tent + Wood Burning Stove"
          intro="Every Davis package pairs a wall tent with a stove sized to it, plus the angle kit, floor and bags to pitch it."
        />
        <ul className="grid gap-4 md:grid-cols-3">
          {stoveFits.map((s, i) => (
            <Reveal as="li" key={s.name} index={i} className="rounded-md border border-bone/20 bg-bone/5 p-5">
              <TentIllustration kind="stove" tone="dark" className="h-32 w-full" />
              <h3 className="mt-3 font-display text-[26px]">{s.name}</h3>
              <p className="data mt-1 opacity-90">Fits {s.fits}</p>
              <p className="data opacity-75">
                {s.weight} · {s.dims}
              </p>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 text-[15px] opacity-85">
          Stove packages {formatPrice(stove.priceMin)} to {formatPrice(stove.priceMax!)}. Be sure to pre-burn your stove prior to placing it in your tent.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/hunting/packages/">Shop packages</ButtonLink>
          <ButtonLink href="/stoves/" variant="inverse">
            Shop stoves
          </ButtonLink>
        </div>
      </Section>

      {/* 9 Specialty tents rail with scale silhouettes */}
      <Section labelledBy="h-specialty">
        <SectionHead
          id="h-specialty"
          eyebrow="Specialty tents"
          title="Smaller tents for every job in camp"
          action={<ButtonLink href="/tents/specialty/" variant="tertiary">View specialty tents</ButtonLink>}
        />
        <Rail label="Specialty tents">
          {specialty.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Rail>
      </Section>

      {/* 10 Glamping for business */}
      <Section tone="alt" labelledBy="h-b2b">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <TentIllustration kind="glamp" className="w-full rounded-md bg-canvas p-6" label="Davis glamping tent on a deck with fly and awning" />
          <div>
            <p className="eyebrow mb-3 text-stone-deep">Glamping for business</p>
            <h2 id="h-b2b">One or a dozen tents, for your property</h2>
            <ul className="mt-6 space-y-3">
              <li className="flex gap-3">
                <Icon name="check" className="mt-1 size-5 text-success" />
                Three standard sizes: 14' × 15', 16' × 20' and 16' × 25', or custom.
              </li>
              <li className="flex gap-3">
                <Icon name="check" className="mt-1 size-5 text-success" />
                Properties including {caseStudies.map((c) => c.name).join(", ")}.
              </li>
              <li className="flex gap-3">
                <Icon name="check" className="mt-1 size-5 text-success" />
                Logistics work for national brands including Samsung, Coachella and Land Rover.
              </li>
            </ul>
            <p className="mt-4 text-[14px] text-stone-deep">{fact("noFurniture")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/glamping/for-business/resorts/">Plan a project</ButtonLink>
              <ButtonLink href="/glamping/" variant="secondary">
                See glamping tents
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* 11 Made in Denver */}
      <Section tone="snow" labelledBy="h-denver">
        <SectionHead id="h-denver" eyebrow="Made in Denver since 1955" title="A family shop, still sewing" intro={fact("familyOwned")} />
        <ol className="grid gap-4 md:grid-cols-4">
          {[
            { t: "1955", d: fact("founding") },
            { t: "The machines", d: fact("machines") },
            { t: "Strength testing", d: fact("strengthTesting") },
            { t: "The showroom", d: fact("showroom") },
          ].map((m, i) => (
            <Reveal as="li" key={m.t} index={i} className="rounded-md border border-line p-5">
              <p className="font-display text-[26px] text-pine">{m.t}</p>
              <p className="mt-2 text-[15px] leading-6">{m.d}</p>
            </Reveal>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact/#visit">Visit the shop</ButtonLink>
          <ButtonLink href="/about/" variant="secondary">
            Our story
          </ButtonLink>
        </div>
      </Section>

      {/* 12 Reviews + 13 Conservation */}
      <Section labelledBy="h-reviews">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3 text-stone-deep">Reviews</p>
            <h2 id="h-reviews">Rated {site.googleRating.value} on Google</h2>
            <p className="mt-3 flex items-center gap-1 text-olive" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" className="size-6 fill-current" />
              ))}
            </p>
            <p className="mt-3 text-[15px] text-stone-deep">
              {site.googleRating.note} Ten video testimonials from customers, including speakers from the Four Seasons Resort and the Mule Deer Foundation.
            </p>
            <ButtonLink href="/reviews/" variant="tertiary" className="mt-6">
              Read reviews
            </ButtonLink>
          </div>
          <div>
            <p className="eyebrow mb-3 text-stone-deep">Conservation</p>
            <h2>We give back to the land we camp on</h2>
            <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 text-[15px] sm:grid-cols-2">
              {conservationPartners.map((c) => (
                <li key={c.name}>{c.name}</li>
              ))}
            </ul>
            <p className="mt-4 text-[15px] text-stone-deep">{fact("donation")}</p>
            <ButtonLink href="/about/conservation/" variant="tertiary" className="mt-6">
              How we give back
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* 14 Learn + 15 Deals */}
      <Section tone="snow" labelledBy="h-learn">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHead id="h-learn" eyebrow="Learn before you buy" title="Guides from the people who sew the tents" />
            <ul className="grid gap-4 sm:grid-cols-3">
              {[
                { t: "Canvas guide", d: "Cotton, treatment and fire rules", href: "/guides/canvas/" },
                { t: "Videos", d: `${videoCategories.length} categories`, href: "/guides/videos/" },
                { t: "FAQ", d: "Answers from the shop floor", href: "/support/faq/" },
              ].map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="block h-full rounded-md border border-line p-5 hover:border-pine">
                    <p className="font-semibold">{r.t}</p>
                    <p className="mt-1 text-[14px] text-stone">{r.d}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {journalPosts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/journal/${p.slug}/`} className="flex items-baseline justify-between gap-4 py-3 hover:underline">
                    <span className="font-semibold">{p.title}</span>
                    <span className="eyebrow shrink-0 text-stone">{p.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md bg-pine p-6 text-bone on-dark">
            <p className="eyebrow mb-3 opacity-80">Deals and signup</p>
            <h2 className="text-[28px]">Monthly specials</h2>
            <p className="mb-4 mt-2 text-[15px] opacity-90">Sign up for our monthly specials and deals on accessories and new products.</p>
            <SignupForm tone="dark" />
            <ButtonLink href="/deals/" variant="inverse" className="mt-2">
              See deals
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* 16 Talk to us */}
      <TalkToUs />
    </>
  );
}
