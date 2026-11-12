import Link from "next/link";
import { TentIllustration } from "../TentIllustration";
import { Icon } from "../ui";
import type { Illustration } from "@/content/catalog";

const camps: { title: string; line: string; href: string; art: Illustration; tone: string }[] = [
  { title: "Hunt", line: "Wall tents and hot-tent packages", href: "/hunting/", art: "package", tone: "bg-pine text-bone" },
  { title: "Glamp", line: "Luxury glamping tents", href: "/glamping/", art: "glamp", tone: "bg-canvas text-charcoal" },
  { title: "Outfit", line: "Packing gear, sleep systems, accessories", href: "/gear/", art: "gear", tone: "bg-surface-alt text-charcoal" },
  { title: "Stoves", line: "Wood-burning stoves sized to your tent", href: "/stoves/", art: "stove", tone: "bg-charcoal text-bone" },
];

/** Homepage section 2 and hero scene 8: four large cards, image scales 1.03 on hover. */
export function CampCards({ compact }: { compact?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
      {camps.map((c) => {
        const dark = c.tone.includes("text-bone");
        return (
          <li key={c.title}>
            <Link
              href={c.href}
              className={`group flex h-full flex-col overflow-hidden rounded-md ${c.tone} ${dark ? "on-dark" : ""} border border-line/40 transition-colors hover:border-ink`}
            >
              <div className={`overflow-hidden ${compact ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
                <TentIllustration kind={c.art} tone={dark ? "dark" : "light"} className="h-full w-full p-4 transition-transform duration-(--motion-slow) ease-out group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-1 flex-col p-4 md:p-5">
                <span className="font-display text-[26px] font-semibold leading-8 md:text-[32px]">{c.title}</span>
                <span className="mt-1 text-[14px] leading-5 opacity-85 md:text-[15px]">{c.line}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[14px] font-semibold">
                  <span className="sr-only">Shop {c.title}</span>
                  <Icon name="arrow" className="size-5" />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
