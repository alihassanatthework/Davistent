/**
 * FAQ, policy and support records (FAQ and Policy models, ch. 18).
 * The current FAQ has 18 questions in three groups. The answers below are the
 * ones the audit recorded; the full set is migrated from the WordPress export.
 */
export type FaqItem = { q: string; a: string; group: "Wall tents" | "Camp stoves" | "General information"; source: string };

export const faqs: FaqItem[] = [
  {
    group: "Wall tents",
    q: "What size tent do I need?",
    a: "Allow room for cots, a stove and an eating area. If you are between sizes, size up. Our sizing guide lists how many each tent sleeps.",
    source: "/about-us/faqs/",
  },
  {
    group: "Wall tents",
    q: "Do your tents come with a frame?",
    a: "No. Frames are sold separately. A 14' × 15' tent needs 17 sticks of 1\" EMT in 10' lengths; the Go Tent needs 9. You can order angles only with a cut list and buy EMT locally to save freight.",
    source: "/product/canvas-tent-14-x-15/",
  },
  {
    group: "Wall tents",
    q: "Internal frame or traditional poles?",
    a: "Internal frames suit long-term setups. Traditional poles pack smaller and weigh about half as much, and can be packed on horseback.",
    source: "/about-us/faqs/",
  },
  {
    group: "Wall tents",
    q: "What is a sod cloth?",
    a: "A band of material sewn in around the inside bottom of the tent that keeps drafts and snow out. Our standard sod cloth is 10\"; the FAQ also mentions 10\" to 15\" vinyl.",
    source: "/standard-features-davis-wall-tents/, /about-us/faqs/",
  },
  {
    group: "Wall tents",
    q: "Why don’t you include a tent bag?",
    a: "Canvas bags let food odours out and invite mice into stored tents. A hard container is recommended for storage.",
    source: "/about-us/faqs/",
  },
  {
    group: "Wall tents",
    q: "How do I care for and store my tent?",
    a: "Let it dry for about 48–72 hours before storage. Clean with mild soap and a soft brush. Store in a hard container.",
    source: "/about-us/faqs/",
  },
  {
    group: "Wall tents",
    q: "Can you make a custom size?",
    a: "Yes. Tents over 320 sq ft are $2.95 per sq ft (water and mildew) or $3.63 per sq ft (water, mildew and fire). For anything larger than 16' × 25', call us for a quote.",
    source: "/about-us/faqs/",
  },
  {
    group: "Wall tents",
    q: "Do you repair tents?",
    a: "Yes. Patches are sewn on scheduled repair days once 25 to 35 tents have accumulated. We do not take repairs during hunting season. A patch kit handles small holes.",
    source: "/about-us/faqs/",
  },
  {
    group: "Camp stoves",
    q: "Which stove fits my tent?",
    a: "Valley fits 12' × 15' and smaller; Ridge fits 12' × 15' to 14' × 15'; Peak fits 14' × 15' and larger. All need a 5.5\" or larger stove jack.",
    source: "/product/wood-burning-camp-stove/",
  },
  {
    group: "Camp stoves",
    q: "Do I need to pre-burn my stove?",
    a: "Yes. Be sure to pre-burn your stove prior to placing it in your tent.",
    source: "/product/wood-burning-camp-stove/",
  },
  {
    group: "General information",
    q: "Where are you located?",
    a: "Our shop is at 4230 Broadway Street, Denver, CO 80216. Shop and showroom tours are offered; call ahead to arrange a visit.",
    source: "/about-us/faqs/",
  },
  {
    group: "General information",
    q: "Can you ship to every state?",
    a: "We cannot ship tents to CA, LA, MA, MI, MN, NY, NJ or Canada without the FIRE treatment.",
    source: "/product/canvas-wall-tents/",
  },
];

/** Return policy, six terms verbatim (ch. 3). */
export const returnTerms = [
  "Returns must be authorized by Davis Tent.",
  "Request a return within 30 days of receipt.",
  "A 15–25% restock fee applies.",
  "Items must be in new, unused condition.",
  "Custom orders are not eligible for returns.",
  "No return request will be accepted after 90 days.",
];

export const conservationPartners = [
  { name: "Coloradans for Responsible Wildlife Management", lifetime: false },
  { name: "The Rocky Mountain Elk Foundation", lifetime: true },
  { name: "The Mule Deer Foundation", lifetime: true },
  { name: "Colorado Outfitters Association", lifetime: false },
  { name: "Colorado Foundation for Agriculture", lifetime: false },
  { name: "Rocky Mountain Bighorn Society", lifetime: true },
  { name: "Safari Club International", lifetime: true },
  { name: "Foundation for North American Wild Sheep", lifetime: true },
  { name: "The Fallen Outdoors", lifetime: false },
  { name: "Camp Gratitude", lifetime: false },
];
/** Which partners carry the asterisk is not recorded in the audit; flags above are placeholders pending the crawl. */
export const lifetimeFlagsConfirmed = false;

export const press = [
  { title: "Monument Glamping story", outlet: "American Glamping Association", date: null as string | null },
  { title: "Davis Tent features", outlet: "Rokslide", date: null },
  { title: "Podcast appearances (nine or more)", outlet: "Hunting and outdoor podcasts", date: null },
];

export const caseStudies = [
  {
    slug: "heidis-shire",
    name: "Heidi’s Shire",
    location: "27 acres west of Broken Bow",
    facts: ["AC and heat", "Running water", "Full bath", "Kitchenette", "Wood stove"],
    summary: "Davis glamping tents set up as fully serviced guest suites.",
    read: true,
  },
  {
    slug: "inn-town-campground",
    name: "Inn Town Campground",
    location: "To be confirmed",
    facts: [],
    summary: "Case study page not read in the audit. Content to be migrated.",
    read: false,
  },
  {
    slug: "piney-river-ranch",
    name: "Piney River Ranch",
    location: "To be confirmed",
    facts: [],
    summary: "Case study page not read in the audit. Content to be migrated.",
    read: false,
  },
];

export const videoCategories = [
  { id: "setup", title: "Setup and pitching", count: null as number | null },
  { id: "products", title: "Product walk-throughs", count: null },
  { id: "stoves", title: "Stoves", count: null },
  { id: "glamping", title: "Glamping", count: null },
  { id: "testimonials", title: "Customer video reviews", count: 10 },
  { id: "factory", title: "Inside the Denver shop", count: null },
];

export const businessSegments = {
  resorts: {
    title: "Glamping tents for resorts",
    promise: "Safari-style canvas tents built in Denver for luxury properties.",
    proof: [
      "Davis has been refining our safari tent glamping systems for almost two decades.",
      "Dozens of luxury properties internationally.",
      "Logistics work for national brands including Samsung, Coachella, Land Rover, Firefly, Jim Beam and We Work.",
    ],
  },
  campgrounds: {
    title: "Glamping tents for campgrounds",
    promise: "One or a dozen tents, sized for your sites.",
    proof: [
      "One or a dozen tents.",
      "Resort customers include Heidi’s Shire, Inn Town Campground and Piney River Ranch.",
      "Davis Tent doesn’t build decks, but partners with a deck builder.",
    ],
  },
  "rv-resorts": {
    title: "Glamping tents for RV resorts",
    promise: "Add canvas glamping units alongside your RV sites.",
    proof: [
      "One or a dozen tents.",
      "Three standard sizes from 14' × 15' to 16' × 25', or custom.",
      "Davis Tent doesn’t build decks, but partners with a deck builder.",
    ],
  },
} as const;
export type Segment = keyof typeof businessSegments;

export const states = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

export const journalPosts = [
  { slug: "maintaining-your-wall-tent", title: "Maintaining your wall tent", category: "Care", excerpt: "Drying, cleaning and storing canvas so it lasts a lifetime." },
  { slug: "measuring-for-a-rain-fly", title: "Measuring for a rain fly", category: "How-to", excerpt: "How to measure your tent for a fly that fits." },
  { slug: "cowboy-bedroll", title: "The cowboy bedroll", category: "Gear", excerpt: "Why a canvas bedroll still earns its place on the pack string." },
];
