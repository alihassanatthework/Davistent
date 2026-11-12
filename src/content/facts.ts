/**
 * Fact register (Roadmap ch. 18 "Fact" model, ch. 22 step 4).
 * Every company-wide claim is stored once and referenced everywhere.
 *
 * status "needs-confirmation": the current site disagrees with itself, or the
 * claim must be confirmed by the client before publication.
 */
export type FactStatus = "verified" | "needs-confirmation";

export type Fact = {
  statement: string;
  source: string;
  status: FactStatus;
  conflicts?: string[];
  confirmedBy?: string;
  confirmedDate?: string;
};

const register = {
  founding: { statement: "In 1955 we began manufacturing canvas wall tents and outdoor gear.", source: "/", status: "verified" },
  origin: { statement: "Handcrafted in Denver, Colorado Since 1955", source: "/all-tents/, /hunting-tents/", status: "verified" },
  familyOwned: { statement: "Founded in 1955 in Denver, Colorado. A family-owned manufacturer.", source: "/about-us/", status: "verified" },
  experience: {
    statement: "With over 70 years of experience",
    source: "/, /about-us/",
    status: "needs-confirmation",
    conflicts: ["“For almost 60 years” (/you-are-buying-fabric/)", "“over 60 years” (/davis-tent-experience/)"],
  },
  madeInUsa: {
    statement: "All our tents are proudly built in the USA in our facility in Denver, Colorado.",
    source: "/about-us/",
    status: "verified",
    conflicts: ["Applies to tents only until the client confirms other product lines."],
  },
  facilitySize: {
    statement: "Our Denver factory",
    source: "/about-us/, /the-facility/",
    status: "needs-confirmation",
    conflicts: ["20,000 sq. ft. (/about-us/)", "34,000 sq. ft. (/the-facility/)"],
  },
  canvasWeight: {
    statement: "10 oz. double-fill cotton army duck",
    source: "/, /about-us/",
    status: "needs-confirmation",
    conflicts: ["10 oz (/, /about-us/)", "10.10 oz (/you-are-buying-fabric/)"],
  },
  cottonOnly: { statement: "We only use cotton canvas to make our tents.", source: "/you-are-buying-fabric/", status: "verified" },
  longFiber: { statement: "Uncombed, long-fiber canvas", source: "/, /about-us/", status: "verified" },
  tearStrength: { statement: "Its tear and burst strength is nearly double that of comparable fabrics.", source: "/", status: "verified" },
  sunforgerUs: { statement: "Sunforger® treatment is only applied in the United States.", source: "/, /about-us/", status: "verified" },
  sunforgerButler: { statement: "The Sunforger® treatment is applied to our canvas in Butler, GA.", source: "/you-are-buying-fabric/", status: "verified" },
  resistance: { statement: "Highly resistant to moisture, mildew and UV damage.", source: "/, /about-us/", status: "verified" },
  lifetime: { statement: "With proper care, our canvas will easily last our average user a lifetime.", source: "/you-are-buying-fabric/", status: "verified" },
  modular: { statement: "Most of our tents are modular so adding on in the future is possible.", source: "/", status: "verified" },
  fireShipping: {
    statement: "We cannot ship tents to CA, LA, MA, MI, MN, NY, NJ or Canada without the FIRE treatment.",
    source: "/product/canvas-wall-tents/",
    status: "verified",
  },
  condensation: {
    statement: "Four people in a tent produces two liters of condensation from their breath in one night!",
    source: "/specialty-tents/",
    status: "needs-confirmation",
    conflicts: ["Unsourced. Keep as the brand’s statement or cite a source."],
  },
  customPricing: {
    statement:
      "Custom tents over 320 sq ft are $2.95 per sq ft (water and mildew) or $3.63 per sq ft (water, mildew and fire). Larger than 16' × 25': call for a quote.",
    source: "/about-us/faqs/, /hunting-tents/",
    status: "verified",
  },
  leadTime: { statement: "Some custom tents may require 4 weeks production lead time.", source: "/product/elk-camp-complete-package/", status: "verified" },
  drying: { statement: "Let your tent dry for about 48–72 hours before storage.", source: "/about-us/faqs/", status: "verified" },
  competitive: { statement: "Competitively priced with overseas products.", source: "/", status: "verified" },
  hunters: { statement: "Made for hunters by hunters.", source: "/davis-tent-experience/", status: "verified" },
  strengthTesting: {
    statement: "We rigorously strength test our products: visual inspection, tear strength and burst testing.",
    source: "/strength-testing/",
    status: "verified",
  },
  machines: {
    statement: "Sewing machines dating back to the early 1900s work alongside state of the art automated machines.",
    source: "/about-us/, /the-machines/",
    status: "verified",
  },
  showroom: { statement: "Our showroom displays some of our tents. Shop and showroom tours are offered.", source: "/the-showroom/", status: "verified" },
  warranty: {
    statement: "",
    source: "/product/wood-burning-camp-stove/",
    status: "needs-confirmation",
    conflicts: ["No warranty page found. Stove page says “Guaranteed!”; its meta description mentions a lifetime warranty."],
  },
  donation: { statement: "100% of your donation goes to the selected Foundation.", source: "/conservation/", status: "verified" },
  noFurniture: { statement: "Glamping tents do not include furniture or deck.", source: "/small-glamping-tents/", status: "verified" },
} satisfies Record<string, Fact>;

export type FactKey = keyof typeof register;
export const facts: Record<FactKey, Fact> = register;
export const fact = (key: FactKey) => facts[key].statement;

/** Decisions the client must make before design starts (ch. 2). */
export const clientDecisions = [
  "Which figure is correct for the factory: 20,000 or 34,000 sq ft.",
  "Which canvas weight to state: 10 oz or 10.10 oz.",
  "What warranty, if any, applies to tents and to stoves.",
  "Whether “Made in the USA” applies to every product line, or to tents only.",
  "Showroom address, opening hours and pickup terms for publication.",
  "Budget appetite for 3D production of the hero (full or reduced option).",
];
