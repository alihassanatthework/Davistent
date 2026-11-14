import Link from "next/link";
import { Icon } from "../ui";
import { TentIllustration } from "../TentIllustration";
import type { Illustration } from "@/content/catalog";

/**
 * Photo per tile (CR-04). None supplied yet: REDESIGN_IMAGES.md lists what is
 * needed (hunt camp, glamping tent at dusk, packing gear on canvas, stove
 * close-up). Until then each tile shows its line drawing on a Charcoal ground.
 */
const camps: { title: string; line: string; href: string; art: Illustration; photo?: { src: string; alt: string } }[] = [
  { title: "Hunt", line: "Wall tents and hot-tent packages", href: "/hunting/", art: "package", photo: { src: "/products/Canvas-Wall-Tent-Davis-Tent-3.3.jpg", alt: "Hunters at a Davis canvas wall tent in the snow" } },
  { title: "Glamp", line: "Luxury glamping tents", href: "/glamping/", art: "glamp" },
  { title: "Outfit", line: "Packing gear, sleep systems, accessories", href: "/gear/", art: "gear" },
  { title: "Stoves", line: "Wood-burning stoves sized to your tent", href: "/stoves/", art: "stove" },
];

/**
 * Homepage section 2 (CR-04): four photo tiles with a bottom scrim and a capital
 * label. 2 × 2 at 4:5 on mobile, four in a row at 3:4 on tablet and 4:5 on
 * desktop. Motion: image 1.00 to 1.04 in 300 ms and the arrow 4 px in 150 ms,
 * on hover-capable devices only.
 */
export function CampCards() {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
      {camps.map((c) => (
        <li key={c.title}>
          <Link
            href={c.href}
            data-surface="dark"
            className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-md bg-ink text-bone md:aspect-[3/4] lg:aspect-[4/5]"
          >
            {!c.photo && (
              <TentIllustration
                kind={c.art}
                tone="dark"
                className="absolute inset-x-0 top-0 h-[68%] w-full p-4 transition-transform duration-(--motion-slow) ease-out group-hover:scale-[1.04]"
              />
            )}
            {c.photo && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.photo.src}
                  alt={c.photo.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-(--motion-slow) ease-out group-hover:scale-[1.04]"
                />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-ink/70 to-transparent" />
              </>
            )}
            <div className="relative p-4 md:p-5">
              <span className="flex items-center justify-between gap-2">
                <span className="font-display text-[22px] leading-6">
                  <span className="sr-only">Shop </span>
                  {c.title}
                </span>
                <Icon name="arrow" className="size-5 shrink-0 transition-transform duration-(--motion-fast) ease-out group-hover:translate-x-1" />
              </span>
              <span className="mt-1 block text-[14px] leading-5 text-ash">{c.line}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
