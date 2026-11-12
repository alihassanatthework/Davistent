import { getImageProps } from "next/image";
import { ButtonLink } from "../ui";
import { TentIllustration } from "../TentIllustration";
import { fact } from "@/content/facts";

/**
 * Homepage hero (CR-07): one photograph, one statement, one action.
 * No scroll effect, no canvas, no script. The entrance is CSS only (globals.css
 * .hero__*), runs once on first paint and is at rest by 600 ms.
 *
 * Photo slot: the client's hunt-camp photograph (landscape ≥ 2400 px plus a
 * portrait crop) is still needed. Until it is supplied the slot is a flat
 * Charcoal ground with the hunt-camp line drawing on the right (desktop only);
 * set `photo` below to switch on the image and its scrim.
 */
type HeroPhoto = { landscape: string; portrait: string; alt: string };
const photo: HeroPhoto | null = null;

export function Hero() {
  return (
    <section
      aria-labelledby="hero-h1"
      data-surface="dark"
      className="relative flex h-[78svh] flex-col justify-end overflow-hidden bg-ink pt-[var(--header-h)] md:h-[70svh] lg:h-[min(100svh,calc(820px+var(--header-h)))]"
    >
      {photo ? (
        <HeroImage photo={photo} />
      ) : (
        <div aria-hidden className="hero__photo absolute inset-0 bg-ink">
          <TentIllustration kind="package" tone="dark" className="absolute bottom-[8%] right-[4%] hidden h-[62%] w-[46%] lg:block" />
        </div>
      )}
      <div className="container-site relative pb-12 md:pb-16 lg:pb-[12vh]">
        <div className="max-w-2xl">
          <p className="hero__eyebrow eyebrow text-tan">{fact("origin")}</p>
          <h1 id="hero-h1" className="hero__title hero-title mt-4">
            Canvas Tents, Glamping Tents &amp; Camping Gear
          </h1>
          <div className="hero__actions mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/tents/" size="hero">
              Shop tents
            </ButtonLink>
            <ButtonLink href="/build/" variant="inverse" size="hero">
              Build your tent
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroImage({ photo }: { photo: HeroPhoto }) {
  const common = { alt: photo.alt, fill: true, sizes: "100vw", priority: true, quality: 70 } as const;
  const { props: wide } = getImageProps({ ...common, src: photo.landscape });
  const { props: tall } = getImageProps({ ...common, src: photo.portrait });
  return (
    <>
      <picture className="hero__photo absolute inset-0">
        <source media="(min-width: 768px)" srcSet={wide.srcSet} sizes={wide.sizes} />
        <img {...tall} alt={photo.alt} fetchPriority="high" className="h-full w-full object-cover" />
      </picture>
      {/* Scrim: bottom-up on mobile, left-to-right on desktop. The only gradient allowed. */}
      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/75 to-transparent md:bg-linear-to-r" />
    </>
  );
}
