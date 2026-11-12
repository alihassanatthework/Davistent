import { site } from "@/content/site";

/**
 * Trust strip under the hero (CR-06): four short facts that already appear on
 * the site, in capitals (CSS), separated by thin Steel rules. No icons, no
 * animation. One row from 1024 px; two by two on mobile.
 *
 * Each label is a short form of an existing record, with the scope the site
 * already uses:
 *  - Since 1955               facts.origin ("Handcrafted in Denver, Colorado Since 1955")
 *  - Tents made in the USA    facts.madeInUsa ("All our tents are proudly built in the USA…"): tents only
 *  - Sunforger® treated canvas facts.sunforgerUs / product summaries ("Sunforger®-treated cotton canvas")
 *  - Phone                    site.phone
 */
const items = ["Since 1955", "Tents made in the USA", "Sunforger® treated canvas"];

export function TrustStrip() {
  const cell = "flex min-h-11 items-center justify-center px-3 text-center lg:min-h-14";
  return (
    <div data-surface="dark" className="border-b border-steel bg-gunmetal text-bone">
      <ul className="container-site nav-label grid grid-cols-2 text-[12px] lg:grid-cols-4 lg:text-[14px] [&>li]:border-steel max-lg:[&>li:nth-child(odd)]:border-r max-lg:[&>li:nth-child(-n+2)]:border-b lg:[&>li+li]:border-l">
        {items.map((t) => (
          <li key={t} className={cell}>
            {t}
          </li>
        ))}
        <li className={cell}>
          <a href={`tel:${site.phone.tel}`} className="data inline-flex min-h-11 items-center text-[13px] text-bone hover:underline lg:text-[14px]">
            {site.phone.display}
          </a>
        </li>
      </ul>
    </div>
  );
}
