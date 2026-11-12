import { products, priceLabel } from "@/content/catalog";
import { faqs } from "@/content/support";

/**
 * Static search index built at build time (ch. 18: "a static index built at
 * publish time, queried in the browser"). About 111 products and a few hundred
 * pages do not need a hosted search service.
 */
export type SearchDoc = { id: string; type: "Products" | "Guides" | "Questions"; title: string; href: string; meta?: string; text: string };

const guides: Omit<SearchDoc, "type">[] = [
  { id: "g-canvas", title: "Canvas and treatment guide", href: "/guides/canvas/", text: "cotton army duck double fill long fiber sunforger butler georgia fire treatment cpai-84 mildew uv" },
  { id: "g-features", title: "Standard features on every wall tent", href: "/guides/standard-features/", text: "walls zipper ykk stove jack sod cloth ridge eave sleeves ropes tensioners stakes" },
  { id: "g-size", title: "What size tent do I need?", href: "/guides/size/", text: "size finder party sleeps cots stove floor plan" },
  { id: "g-videos", title: "Videos", href: "/guides/videos/", text: "video setup youtube how to pitch" },
  { id: "g-season", title: "Hunting season dates by state", href: "/guides/season-dates/", text: "hunting season dates state wildlife" },
  { id: "g-glamp", title: "Glamping tent guide", href: "/glamping/guide/", text: "glamping fabric treatment deck winter fly upgrades" },
  { id: "g-builder", title: "Custom tent builder", href: "/build/", text: "build custom configure tent options price" },
  { id: "g-returns", title: "Returns", href: "/support/returns/", text: "return policy restock fee 30 days" },
  { id: "g-contact", title: "Contact and visit", href: "/contact/", text: "contact phone email address showroom visit denver broadway" },
  { id: "g-made", title: "Made in Denver", href: "/about/made-in-denver/", text: "factory facility machines strength testing showroom" },
];

export function buildIndex(): SearchDoc[] {
  return [
    ...products
      .filter((p) => p.category !== "stove-part" || p.priceMin > 0)
      .map((p) => ({
        id: p.id,
        type: "Products" as const,
        title: p.name,
        href: p.href,
        meta: [p.sizeLabel, priceLabel(p)].filter(Boolean).join(" · "),
        text: [p.name, p.sizeLabel, p.summary, p.category, p.size?.join("x"), p.uses?.join(" ")].filter(Boolean).join(" "),
      })),
    ...guides.map((g) => ({ ...g, type: "Guides" as const })),
    ...faqs.map((f, i) => ({ id: `faq-${i}`, type: "Questions" as const, title: f.q, href: `/support/faq/#q-${i}`, text: `${f.q} ${f.a}` })),
  ];
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/(\d+)\s*(?:'|ft|feet)?\s*(?:x|×|by)\s*(\d+)/g, "$1x$2")
    .replace(/[^a-z0-9x.\s]/g, " ");

/** Edit distance ≤ 1 for words of 4+ letters, so "glampng" still finds glamping. */
function near(a: string, b: string) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1 || a.length < 4) return false;
  let i = 0,
    j = 0,
    edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

export function query(index: SearchDoc[], q: string, limit = 12) {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const scored = index
    .map((d) => {
      const title = norm(d.title);
      const words = norm(`${d.title} ${d.text}`).split(/\s+/);
      let score = 0;
      for (const t of terms) {
        if (title.includes(t)) score += 5;
        else if (words.some((w) => w.startsWith(t))) score += 3;
        else if (words.some((w) => near(w, t))) score += 1;
        else return { d, score: 0 };
      }
      return { d, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scored.map((s) => s.d);
}
