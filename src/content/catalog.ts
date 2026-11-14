/**
 * Catalogue seed (Roadmap ch. 3 "Product catalogue as found").
 * Prices are as displayed on 12 November 2026 and will be replaced by live
 * WooCommerce data through src/lib/commerce.ts once the store API is connected.
 * `needsConfirmation` marks items whose price or data the current site contradicts.
 */
export type Category =
  | "wall"
  | "package"
  | "specialty"
  | "glamping"
  | "stove"
  | "stove-part"
  | "frame"
  | "accessory"
  | "fly"
  | "packing"
  | "sleep"
  | "carry"
  | "deal"
  | "gift";

export type Illustration = "wall" | "package" | "spike" | "single-pole" | "cook" | "small" | "glamp" | "stove" | "frame" | "gear" | "cot" | "bag" | "tag";

export type Spec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  href: string;
  legacyUrl: string;
  priceMin: number;
  priceMax?: number;
  compareMin?: number;
  compareMax?: number;
  /** Feet, width × length. */
  size?: [number, number];
  sizeLabel?: string;
  sleeps?: string;
  sleepsMax?: number;
  summary: string;
  illustration: Illustration;
  /** Real photograph in /public/products, when we have one. */
  image?: string;
  uses?: ("solo" | "spike" | "cook" | "wash" | "storage" | "family" | "hunt" | "glamp")[];
  stoveIncluded?: boolean;
  specs?: Spec[];
  included?: string[];
  compatibleSizes?: string[];
  status?: "in-stock" | "lead-time" | "waitlist" | "sale";
  needsConfirmation?: string;
  popular?: boolean;
};

const sizeLabel = (w: number, l: number) => `${w}' × ${l}'`;

/* ---------------- Canvas wall tents ---------------- */
const wallSizes: [number, number, string, number, number, number][] = [
  [10, 15, "1-2", 2, 1137, 2458],
  [12, 15, "1-3", 3, 1376, 2760],
  [14, 15, "3-4", 4, 1576, 3080],
  [14, 20, "4", 4, 1821, 3425],
  [16, 20, "6", 6, 1952, 3624],
  [16, 25, "8", 8, 2278, 4105],
];

const wallTents: Product[] = wallSizes.map(([w, l, sleeps, max, min, maxP]) => ({
  id: `wall-${w}x${l}`,
  slug: `${w}x${l}`,
  name: `Canvas Wall Tent ${sizeLabel(w, l)}`,
  category: "wall",
  href: `/tents/wall/${w}x${l}/`,
  legacyUrl: `/product/canvas-tent-${w}-x-${l}/`,
  priceMin: min,
  priceMax: maxP,
  size: [w, l],
  sizeLabel: sizeLabel(w, l),
  sleeps,
  sleepsMax: max,
  summary: `A ${sizeLabel(w, l)} Sunforger®-treated cotton canvas wall tent, built to order in Denver.`,
  illustration: "wall",
  uses: ["hunt", "family"],
  stoveIncluded: false,
  compatibleSizes: [`${w}x${l}`],
  specs: [
    { label: "Floor size", value: sizeLabel(w, l) },
    { label: "Floor area", value: `${w * l} sq ft` },
    { label: "Sleeps (as listed)", value: sleeps },
    { label: "Walls", value: "5' cut, finish at 4' 8\"" },
    { label: "Fabric", value: "10 oz double-fill cotton army duck (weight to be confirmed)" },
    { label: "Treatment", value: "Water and mildew, or water, mildew and fire" },
    { label: "Stove jack", value: "5.5\" inside left; 4\" or 6\" available" },
    { label: "Frame", value: w === 14 && l === 15 ? "Not included. Needs 17 sticks of 1\" EMT in 10' lengths" : "Not included" },
    { label: "Weight", value: "To be supplied by Davis Tent" },
  ],
  status: "lead-time",
}));
wallTents[2].popular = true;
/* Photographs supplied by Davis Tent, in the order of the live all-tents page. */
const wallPhotos = ["Canvas-Wall-Tent-Davis-Tent-1", "Canvas-Wall-Tent-Davis-Tent-1-1", "Canvas-Wall-Tent-Davis-Tent-2", "Canvas-Wall-Tent-Davis-Tent-3.3", "Canvas-Wall-Tent-Davis-Tent-4", "Canvas-Wall-Tent-Davis-Tent-5.3"];
wallTents.forEach((t, i) => { t.image = `/products/${wallPhotos[i]}.jpg`; });

/* ---------------- Hunt camp packages with stove ---------------- */
const packageIncluded = [
  "5' walls (cut size)",
  "5.5\" stove jack",
  "Zippered door",
  "Screened window",
  "Screened door",
  "Colorado door",
  "Attached sod cloth",
  "Ridge pole sleeves and eave sleeves",
  "Pre-cut ropes with metal tensioners",
  "Steel stakes in their own bag",
  "3/4 detached floor",
  "Angle kit and rubber feet (kit varies by size)",
  "Wood-burning stove (size varies by tent)",
  "Canvas tent bag, stove bag and three pole bags",
];

const pkg = (
  slug: string,
  name: string,
  w: number,
  l: number,
  sleeps: string,
  max: number,
  sale: [number, number],
  was: [number, number],
  legacy: string,
  stove: string,
): Product => ({
  id: `pkg-${slug}`,
  slug,
  name,
  category: "package",
  href: `/hunting/packages/${slug}/`,
  legacyUrl: legacy,
  priceMin: sale[0],
  priceMax: sale[1],
  compareMin: was[0],
  compareMax: was[1],
  size: [w, l],
  sizeLabel: sizeLabel(w, l),
  sleeps,
  sleepsMax: max,
  summary: `Hot tent: a ${sizeLabel(w, l)} canvas wall tent with a ${stove} wood-burning stove, angle kit and floor.`,
  illustration: "package",
  uses: ["hunt"],
  stoveIncluded: true,
  included: packageIncluded,
  compatibleSizes: [`${w}x${l}`],
  specs: [
    { label: "Tent", value: sizeLabel(w, l) },
    { label: "Sleeps", value: sleeps },
    { label: "Stove", value: stove },
    { label: "Floor", value: "3/4 detached (full floor +$40)" },
    { label: "Lead time", value: "Some custom tents may require 4 weeks" },
  ],
  status: "sale",
});

const packages: Product[] = [
  pkg("turkey", "Turkey Camp Package", 10, 15, "2", 2, [1999, 2179], [2201, 2387], "/product/canvas-tent-with-stove-10-x-15/", "Valley"),
  pkg("antelope", "Antelope Camp Package", 12, 15, "2", 2, [2229, 2451], [2450, 2689], "/product/antelope-camp-complete-package/", "Valley"),
  pkg("elk", "Elk Camp Package", 14, 15, "4", 4, [2489, 2795], [2740, 3069], "/product/elk-camp-complete-package/", "Ridge"),
  pkg("elk-plus", "Elk Plus Camp Package", 14, 20, "4", 4, [2799, 3107], [3080, 3414], "/product/elk-plus-camp-tent-package/", "Peak"),
  pkg("grizzly", "Grizzly Camp Package", 16, 20, "6", 6, [2989, 3357], [3287, 3689], "/product/grizzly-camp-complete-package/", "Peak"),
  pkg("bison", "Bison Camp Package", 16, 25, "8", 8, [3369, 3771], [3698, 4130], "/product/bison-camp-tent-package/", "Peak"),
];
packages[2].popular = true;
packages[2].summary += " Save at least $220 on the Elk package.";

/* ---------------- Specialty tents ---------------- */
const specialty: Product[] = [
  {
    id: "go-tent",
    slug: "go-tent",
    name: "Go Tent",
    category: "specialty",
    href: "/tents/specialty/go-tent/",
    legacyUrl: "/go-tent/",
    priceMin: 638,
    priceMax: 1293,
    size: [10, 10],
    sizeLabel: "10' × 10' or 12' × 12'",
    sleeps: "2-3",
    sleepsMax: 3,
    summary: "A lighter canvas tent with 34-inch walls, on an internal frame or traditional poles.",
    illustration: "small",
    uses: ["solo", "spike", "family"],
    popular: true,
    needsConfirmation: "Also shown from $599 on /hunting-tents/. 12' × 12' traditional pole weight printed as “39bs”.",
    specs: [
      { label: "Walls", value: "34\"" },
      { label: "10' × 10' peak", value: "6' 5\" internal frame / 6' 8\" traditional poles" },
      { label: "10' × 10' weight", value: "Tent with sewn floor ~40 lb; traditional poles 25 lb; internal frame 54 lb" },
      { label: "12' × 12' peak", value: "7' 0\" / 7' 2\"" },
      { label: "12' × 12' weight", value: "Tent with sewn floor 57 lb; internal frame 62 lb" },
      { label: "Frame", value: "Needs 9 sticks of EMT. Internal frames are not compatible with sewn-in floors." },
    ],
    included: [
      "10 oz Sunforger canvas",
      "5.5\" stove jack",
      "Traditional pole set",
      "Zipper door",
      "Ridge sleeves",
      "Screen door receiver",
      "Sod cloth",
      "Ropes with tensioners",
      "Stake bag",
    ],
  },
  {
    id: "herder",
    slug: "herder-tent",
    name: "Herder Tent (spike tent)",
    category: "specialty",
    href: "/tents/specialty/herder-tent/",
    legacyUrl: "/product/herder-tent-spike-tent/",
    priceMin: 879,
    priceMax: 1229,
    size: [10, 10],
    sizeLabel: "10' × 10'",
    sleeps: "2",
    sleepsMax: 2,
    summary: "A spike-camp tent that sleeps two.",
    illustration: "spike",
    uses: ["spike", "solo"],
    needsConfirmation: "Also shown at $700 on /hunting-tents/.",
  },
  {
    id: "single-shot",
    slug: "single-shot",
    name: "Single Shot",
    category: "specialty",
    href: "/tents/specialty/single-shot/",
    legacyUrl: "/product/single-shot-canvas-tent/",
    priceMin: 359,
    size: [5, 7],
    sizeLabel: "5' × 7'",
    sleeps: "1",
    sleepsMax: 1,
    summary: "A one-person canvas tent for solo hunts.",
    illustration: "spike",
    uses: ["solo"],
  },
  {
    id: "cook-shack",
    slug: "cook-shack",
    name: "Cook Shack",
    category: "specialty",
    href: "/tents/specialty/cook-shack/",
    legacyUrl: "/product/cook-shack/",
    priceMin: 691,
    priceMax: 1332,
    size: [10, 10],
    sizeLabel: "10, 12, 14 or 16 × 10'",
    summary: "A canvas cook room that stands alone or links to your main tent.",
    illustration: "cook",
    uses: ["cook"],
    needsConfirmation: "Also shown from $550 on /hunting-tents/.",
  },
  {
    id: "royal-throne",
    slug: "royal-throne",
    name: "Royal Throne Shower and Potty Tent",
    category: "specialty",
    href: "/tents/specialty/royal-throne/",
    legacyUrl: "/product/the-royal-throne-shower-potty-tent/",
    priceMin: 399,
    size: [4.75, 4.75],
    sizeLabel: "4' 9\" × 4' 9\"",
    summary: "A private canvas shower and outhouse tent for camp.",
    illustration: "small",
    uses: ["wash"],
    needsConfirmation: "Also shown at $330 on /hunting-tents/.",
  },
  {
    id: "single-pole",
    slug: "single-pole-tent",
    name: "Single Pole Tent",
    category: "specialty",
    href: "/tents/specialty/single-pole-tent/",
    legacyUrl: "/product/single-pole-tent/",
    priceMin: 905,
    priceMax: 1321,
    size: [10, 10],
    sizeLabel: "10' × 10'",
    sleeps: "2",
    sleepsMax: 2,
    summary: "A single-pole canvas tent that sleeps two.",
    illustration: "single-pole",
    uses: ["spike", "family"],
    needsConfirmation: "Also shown at $892 and $749 on other pages.",
  },
  {
    id: "the-shed",
    slug: "the-shed",
    name: "The Shed",
    category: "specialty",
    href: "/tents/specialty/the-shed/",
    legacyUrl: "/product/multi-use-shed/",
    priceMin: 399,
    size: [7, 9],
    sizeLabel: "7' × 9'",
    summary: "A multi-use canvas shed for gear, meat or firewood.",
    illustration: "small",
    uses: ["storage"],
  },
];

/* ---------------- Glamping ---------------- */
const glampIncluded = [
  "UV-rated acrylic-coated rain fly",
  "Awning creating a 7' covered patio",
  "Three screen windows",
  "Oversized removable screen door",
  "Colorado door",
  "Taller door with Vislon zippers",
  "Eave sleeves",
  "Angle kit",
];

const glamping: Product[] = [
  {
    id: "cozy-hideaway",
    slug: "cozy-hideaway",
    name: "The Cozy Hideaway",
    category: "glamping",
    href: "/glamping/cozy-hideaway/",
    legacyUrl: "/small-glamping-tents/",
    priceMin: 2594,
    priceMax: 3439,
    size: [14, 15],
    sizeLabel: "14' × 15'",
    summary: "Interior is 210 square feet + 98 square feet of outside covered space.",
    illustration: "glamp",
    uses: ["glamp"],
    popular: true,
    included: glampIncluded,
    specs: [
      { label: "Interior", value: "210 sq ft" },
      { label: "Covered patio", value: "98 sq ft" },
      { label: "Standard treated canvas", value: "$2,594" },
      { label: "Sunforger All Pro (mildew + sun)", value: "$2,939" },
      { label: "Sunforger Sun Pro (extreme UV)", value: "$3,439" },
      { label: "Colours", value: "White or Autumn Gold; Sun Pro white only" },
      { label: "Frame poles", value: "Not included" },
    ],
  },
  {
    id: "oasis-retreat",
    slug: "oasis-retreat",
    name: "The Oasis Retreat",
    category: "glamping",
    href: "/glamping/oasis-retreat/",
    legacyUrl: "/medium-glamping-tents/",
    priceMin: 3201,
    priceMax: 4198,
    size: [16, 20],
    sizeLabel: "16' × 20'",
    summary: "A 16' × 20' safari-style glamping tent with fly and covered patio.",
    illustration: "glamp",
    uses: ["glamp"],
    included: glampIncluded,
    needsConfirmation: "Product page not read in the audit. Details to be confirmed from the store export.",
  },
  {
    id: "summit-ridge",
    slug: "summit-ridge",
    name: "The Summit Ridge",
    category: "glamping",
    href: "/glamping/summit-ridge/",
    legacyUrl: "/large-glamping-tents/",
    priceMin: 3571,
    priceMax: 4753,
    size: [16, 25],
    sizeLabel: "16' × 25'",
    summary: "The largest standard Davis glamping tent, with fly and covered patio.",
    illustration: "glamp",
    uses: ["glamp"],
    included: glampIncluded,
    needsConfirmation: "Product page not read in the audit. Details to be confirmed from the store export.",
  },
];

/* ---------------- Stoves ---------------- */
const stoves: Product[] = [
  {
    id: "wood-stove",
    slug: "wood-burning-camp-stove",
    name: "Wood-Burning Camp Stove",
    category: "stove",
    href: "/stoves/wood-burning-camp-stove/",
    legacyUrl: "/product/wood-burning-camp-stove/",
    priceMin: 499,
    priceMax: 605,
    summary: "Valley, Ridge and Peak sizes. 10-gauge steel top and door, 12-gauge cold-rolled steel body.",
    illustration: "stove",
    popular: true,
    included: ["Warming tray", "Coal grate", "Nesting stove pipe", "Spark arrestor", "Damper"],
    specs: [
      { label: "Valley (small)", value: "Fits 12' × 15' and smaller · ~69 lb · 24\" × 14\" × 11\"" },
      { label: "Ridge (medium)", value: "Fits 12' × 15' to 14' × 15' · ~88 lb · 28\" × 16\" × 13\"" },
      { label: "Peak (large)", value: "Fits 14' × 15' and larger · ~95 lb · 28\" × 18\" × 14½\"" },
      { label: "Steel", value: "Top and door 10-gauge; body 12-gauge cold-rolled" },
      { label: "Jack", value: "Needs a 5.5\" or larger stove jack" },
      { label: "Options", value: "Water jacket +$95 · stove bag +$75 · baffle +$59 or +$99" },
    ],
  },
  {
    id: "rivers-bend",
    slug: "rivers-bend-stove",
    name: "Rivers Bend Stove",
    category: "stove",
    href: "/stoves/rivers-bend-stove/",
    legacyUrl: "/product/rivers-bend-stove/",
    priceMin: 449,
    priceMax: 583,
    summary: "A wood-burning camp stove from the Davis range.",
    illustration: "stove",
    needsConfirmation: "Product page not read; specifications to come from the store export.",
  },
];

const stoveParts: Product[] = [
  ["stove-mat", "Stove Mat", 60],
  ["converter-kit", "45° Converter Kit", 130],
  ["stove-jack", "Stove Jack", 35],
  ["stove-fan", "Stove Fan", 60],
  ["nesting-pipe", "Nesting Pipe", 99],
  ["elbow-reducer", "Elbow Reducer", 45],
  ["spark-arrestor", "Spark Arrestor", 15],
  ["damper", "Damper", 20],
].map(([slug, name, price]) => ({
  id: slug as string,
  slug: slug as string,
  name: name as string,
  category: "stove-part" as const,
  href: `/stoves/${slug}/`,
  legacyUrl: `/product/${slug}/`,
  priceMin: price as number,
  summary: `${name} for Davis camp stoves.`,
  illustration: "stove" as const,
}));

/* ---------------- Frames, accessories, flys ---------------- */
const allSizes = wallSizes.map(([w, l]) => `${w}x${l}`);

const frames: Product[] = [
  {
    id: "internal-frame",
    slug: "complete-internal-frame",
    name: "Complete Internal Frame (3–6 column)",
    category: "frame",
    href: "/accessories/frames/#internal",
    legacyUrl: "/product-category/frames-poles-angles/",
    priceMin: 439,
    priceMax: 1214,
    summary: "Complete 3, 4, 5 and 6 column frames. Order “Angles Only” with a cut list for local 1\" EMT to save freight.",
    illustration: "frame",
    compatibleSizes: allSizes,
  },
  {
    id: "angle-kit",
    slug: "angle-kit",
    name: "Angle Kit",
    category: "frame",
    href: "/accessories/frames/#angles",
    legacyUrl: "/product-category/frames-poles-angles/",
    priceMin: 0,
    priceMax: 360,
    summary: "Angle fittings for an EMT frame, sized to your tent.",
    illustration: "frame",
    compatibleSizes: allSizes,
    needsConfirmation: "Minimum price shows $0.00 in the store; to be corrected before migration.",
  },
  {
    id: "traditional-poles",
    slug: "traditional-pole-system",
    name: "Traditional Pole System",
    category: "frame",
    href: "/accessories/frames/#traditional",
    legacyUrl: "/product-category/frames-poles-angles/",
    priceMin: 100,
    priceMax: 425,
    summary: "Galvanized steel poles that can be packed on horseback.",
    illustration: "frame",
    compatibleSizes: allSizes,
  },
  {
    id: "glamping-angle-kit",
    slug: "glamping-angle-kit",
    name: "Glamping Angle Kit",
    category: "frame",
    href: "/accessories/frames/#glamping",
    legacyUrl: "/product-category/frames-poles-angles/",
    priceMin: 300,
    priceMax: 420,
    summary: "Angle kit for Davis glamping tents.",
    illustration: "frame",
  },
  {
    id: "column-kit",
    slug: "additional-column-kit",
    name: "Additional Column Kit",
    category: "frame",
    href: "/accessories/frames/#internal",
    legacyUrl: "/product-category/frames-poles-angles/",
    priceMin: 60,
    summary: "Add a column to an internal frame.",
    illustration: "frame",
    compatibleSizes: allSizes,
  },
  {
    id: "pole-bags",
    slug: "pole-bags",
    name: "Pole Bags",
    category: "frame",
    href: "/accessories/frames/#bags",
    legacyUrl: "/product-category/frames-poles-angles/",
    priceMin: 35,
    summary: "Canvas bags for frame poles.",
    illustration: "bag",
    compatibleSizes: allSizes,
  },
];

const accessories: Product[] = [
  { id: "snow-load", slug: "snow-load-pro-kit", name: "Snow Load Pro Kit", priceMin: 35, summary: "Extra support for heavy snow on the ridge." },
  { id: "storage-loft", slug: "storage-loft", name: "Storage Loft", priceMin: 59, summary: "Hang gear up and out of the way." },
  { id: "patch-kit", slug: "patch-kit", name: "Patch Kit", priceMin: 15, priceMax: 25, summary: "For small holes in the field." },
  { id: "cot-organizer", slug: "cot-organizer", name: "Cot Organizer", priceMin: 25, summary: "Keeps essentials at hand beside the cot." },
].map((a) => ({
  ...a,
  category: "accessory" as const,
  href: `/accessories/#${a.slug}`,
  legacyUrl: `/product/${a.slug}/`,
  illustration: "gear" as const,
  compatibleSizes: allSizes,
}));

const flys: Product[] = [
  { id: "fly-poly", slug: "poly-fly", name: "Rain Fly · 12 mil poly-coated nylon", summary: "Light and economical." },
  { id: "fly-vinyl", slug: "vinyl-fly", name: "Rain Fly · 14 oz vinyl-coated ripstop", summary: "Tan or white. Heavy duty." },
  { id: "fly-canvas", slug: "canvas-fly", name: "Rain Fly · 10.10 oz Sunforger canvas", summary: "Breathes like the tent." },
].map((f) => ({
  ...f,
  category: "fly" as const,
  href: `/accessories/flys-awnings/#${f.slug}`,
  legacyUrl: "/tent-flys/",
  priceMin: 0,
  illustration: "wall" as const,
  compatibleSizes: allSizes,
  needsConfirmation: "No prices or sizes are published on /tent-flys/. Prices to come from the store.",
}));

/* ---------------- Gear ---------------- */
const packing: Product[] = [
  { id: "panniers", slug: "pack-saddle-panniers", name: "Pack Saddle Panniers", priceMin: 289, priceMax: 429 },
  { id: "sawbuck", slug: "sawbuck-pack-saddle", name: "Sawbuck Pack Saddle", priceMin: 299, priceMax: 379 },
  { id: "decker", slug: "decker-pack-saddle", name: "Decker Pack Saddle", priceMin: 675 },
  { id: "top-pack", slug: "top-pack", name: "Top Pack", priceMin: 61 },
  { id: "weekender", slug: "weekender-saddle-pannier", name: "Weekender Saddle Pannier", priceMin: 149, priceMax: 210 },
  { id: "rifle-scabbard", slug: "leather-rifle-scabbard", name: "Leather Rifle Scabbard", priceMin: 195 },
  { id: "bedroll", slug: "cowboy-bedroll-tarp", name: "Cowboy Bedroll Tarp", priceMin: 149, priceMax: 169 },
].map((g) => ({
  ...g,
  category: "packing" as const,
  href: `/gear/packing/#${g.slug}`,
  legacyUrl: `/product/${g.slug}/`,
  summary: "Tested and proven for decades in the field.",
  illustration: "gear" as const,
}));

const sleep: Product[] = [
  { id: "big-boy-cot", slug: "big-boy-cot", name: "Big Boy Cot", summary: "7' in length by 2' 6\" in width; sits 18\" above the ground.", illustration: "cot" as const },
  { id: "cot-pad", slug: "cot-pad", name: "Cot Pad", summary: "High-density foam.", illustration: "cot" as const },
  { id: "bag-cover", slug: "sleeping-bag-cover", name: "Sleeping Bag Cover", summary: "10 oz canvas.", illustration: "bag" as const },
].map((s) => ({
  ...s,
  category: "sleep" as const,
  href: `/gear/sleep/#${s.slug}`,
  legacyUrl: "/camp-sleep-systems/",
  priceMin: 0,
  needsConfirmation: "No prices on /camp-sleep-systems/. Prices to come from the store.",
}));

const carry: Product[] = [
  { id: "gear-bag", slug: "gear-bag", name: "Gear Bag", priceMin: 0, summary: "Canvas gear bag." },
  { id: "tent-bag", slug: "tent-bag", name: "Tent Bag", priceMin: 0, summary: "Canvas tent bag." },
  { id: "stove-bag", slug: "stove-bag", name: "Stove Bag", priceMin: 75, summary: "Carries a Davis stove." },
].map((c) => ({
  ...c,
  category: "carry" as const,
  href: `/gear/carry/#${c.slug}`,
  legacyUrl: "/product-category/bags/",
  illustration: "bag" as const,
}));
carry[1].needsConfirmation =
  "The FAQ explains why Davis does not include a tent bag, while packages list one as included. One position to be chosen.";

const deals: Product[] = [
  {
    id: "scratch-dent",
    slug: "scratch-and-dent-tents",
    name: "Scratch and Dent Tents",
    category: "deal",
    href: "/deals/#scratch-and-dent-tents",
    legacyUrl: "/product/scratch-and-dent-tents/",
    priceMin: 803,
    priceMax: 2489,
    summary: "Sale items, clearance items and factory seconds. Condition noted on each tent.",
    illustration: "tag",
    status: "sale",
  },
];

const gift: Product[] = [
  {
    id: "gift-certificate",
    slug: "gift-certificates",
    name: "Online Gift Certificate",
    category: "gift",
    href: "/gift-certificates/",
    legacyUrl: "/product/online-gift-certificates/",
    priceMin: 50,
    priceMax: 2500,
    summary: "Assigned as store credit. Delivered now or on a date you choose.",
    illustration: "tag",
  },
];

export const products: Product[] = [
  ...wallTents,
  ...packages,
  ...specialty,
  ...glamping,
  ...stoves,
  ...stoveParts,
  ...frames,
  ...accessories,
  ...flys,
  ...packing,
  ...sleep,
  ...carry,
  ...deals,
  ...gift,
];

export const byCategory = (...cats: Category[]) => products.filter((p) => cats.includes(p.category));
export const bySlug = (cat: Category, slug: string) => products.find((p) => p.category === cat && p.slug === slug);
export const compatibleWith = (size: string) =>
  products.filter((p) => p.compatibleSizes?.includes(size) && ["frame", "accessory", "fly"].includes(p.category));

/** Stove fit ranges (homepage section 8, stove sizing tool). */
export const stoveFits = [
  { name: "Valley", size: "small", fits: "12' × 15' and smaller", maxArea: 180, weight: "about 69 lb", dims: "24\" × 14\" × 11\"" },
  { name: "Ridge", size: "medium", fits: "12' × 15' to 14' × 15'", maxArea: 210, weight: "about 88 lb", dims: "28\" × 16\" × 13\"" },
  { name: "Peak", size: "large", fits: "14' × 15' and larger", maxArea: Infinity, weight: "about 95 lb", dims: "28\" × 18\" × 14½\"" },
] as const;

export function stoveFor(area: number) {
  if (area <= 150) return stoveFits[0];
  if (area <= 210) return stoveFits[1];
  return stoveFits[2];
}

export const formatPrice = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function priceLabel(p: Pick<Product, "priceMin" | "priceMax">) {
  if (!p.priceMin) return "Price in store";
  if (p.priceMax && p.priceMax !== p.priceMin) return `From ${formatPrice(p.priceMin)}`;
  return formatPrice(p.priceMin);
}
