import { getImageProps } from "next/image";
import { ButtonLink } from "../ui";
import { CampfireScene } from "./campfire/CampfireScene";
import { fact } from "@/content/facts";

/**
 * Homepage hero (CR-07): one photograph, one statement, one action.
 * No scroll effect, no canvas, no script. The entrance is CSS only (globals.css
 * .hero__*), runs once on first paint and is at rest by 600 ms.
 *
 * Background: an animated night campsite drawn live on a canvas (owner request;
 * see REDESIGN_IMAGES.md). It sits behind all content under a dark scrim. If a
 * real photograph is supplied, set `photo` below and it replaces the scene.
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
        <>
          <div aria-hidden className="hero__photo absolute inset-0 bg-ink">
            <CampfireScene className="absolute inset-0 h-full w-full" />
          </div>
          {/* Scrim for text contrast: bottom-up below 1024 px, left-to-right on desktop */}
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/55 to-ink/0 lg:bg-linear-to-r lg:from-ink/80 lg:via-ink/30 lg:to-transparent" />
        </>
      )}
      <div className="container-site relative z-10 pb-12 md:pb-16 lg:pb-[12vh]">
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
      {/* Scrim: bottom-up below 1024 px, left-to-right on desktop. The only gradient allowed. */}
      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/75 to-transparent md:bg-linear-to-r" />
    </>
  );
}
