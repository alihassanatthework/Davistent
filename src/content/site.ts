/**
 * Settings record (Roadmap ch. 18, "Settings" model).
 * Values marked `confirmed: false` are listed in the client decision log.
 */
export const site = {
  name: "Davis Tent",
  legalName: "Davis Tent®",
  url: "https://www.davistent.com",
  tagline: "Quality | Innovation | Trust",
  phone: { display: "(877) 355-2267", tel: "+18773552267" },
  email: "sales@davistent.com",
  address: {
    street: "4230 Broadway Street",
    city: "Denver",
    region: "CO",
    postalCode: "80216",
    country: "US",
    /** Only published on /about-us/faqs/ today. Client to confirm before launch. */
    confirmed: false,
  },
  /** No opening hours are published anywhere on the current site. */
  hours: null as null | string,
  social: [
    { label: "YouTube", href: "https://www.youtube.com/@davistent" },
    { label: "Facebook", href: "https://www.facebook.com/davistent" },
    { label: "Instagram", href: "https://www.instagram.com/davistent" },
  ],
  /** WooCommerce store origin for cart, checkout and account (kept on the store). */
  storeUrl: process.env.NEXT_PUBLIC_STORE_URL ?? "https://www.davistent.com",
  googleRating: { value: 4.8, note: "Google rating. Review count is pulled live at build." },
} as const;

export type NavLink = { label: string; href: string };
export type NavGroup = { heading: string; links: NavLink[] };
export type NavItem = {
  label: string;
  href: string;
  primary?: boolean;
  blurb: string;
  groups: NavGroup[];
  featured?: { label: string; href: string; meta: string };
};

/** Seven top-level destinations replace eight overlapping menus (ch. 8). */
export const nav: NavItem[] = [
  {
    label: "Hunt",
    href: "/hunting/",
    primary: true,
    blurb: "Wall tents, hot-tent packages and specialty tents for hunting camp.",
    groups: [
      {
        heading: "Hunting tents",
        links: [
          { label: "All hunting tents", href: "/hunting/" },
          { label: "Packages with stove", href: "/hunting/packages/" },
          { label: "Canvas wall tents", href: "/tents/" },
          { label: "Specialty tents", href: "/tents/specialty/" },
        ],
      },
      {
        heading: "Plan",
        links: [
          { label: "Custom tent builder", href: "/build/" },
          { label: "What size do I need?", href: "/guides/size/" },
          { label: "Hunting season dates", href: "/guides/season-dates/" },
        ],
      },
    ],
    featured: { label: "Elk Camp Package", href: "/hunting/packages/elk/", meta: "14' × 15' · sleeps 4" },
  },
  {
    label: "Glamp",
    href: "/glamping/",
    primary: true,
    blurb: "Luxury glamping tents for your own land, resorts and campgrounds.",
    groups: [
      {
        heading: "Glamping tents",
        links: [
          { label: "All glamping tents", href: "/glamping/" },
          { label: "The Cozy Hideaway", href: "/glamping/cozy-hideaway/" },
          { label: "The Oasis Retreat", href: "/glamping/oasis-retreat/" },
          { label: "The Summit Ridge", href: "/glamping/summit-ridge/" },
          { label: "Custom sizes", href: "/glamping/custom/" },
        ],
      },
      {
        heading: "For business",
        links: [
          { label: "Resorts", href: "/glamping/for-business/resorts/" },
          { label: "Campgrounds", href: "/glamping/for-business/campgrounds/" },
          { label: "RV resorts", href: "/glamping/for-business/rv-resorts/" },
          { label: "Projects", href: "/glamping/projects/heidis-shire/" },
        ],
      },
      {
        heading: "Learn",
        links: [
          { label: "Glamping tent guide", href: "/glamping/guide/" },
          { label: "Glamping accessories", href: "/glamping/accessories/" },
        ],
      },
    ],
    featured: { label: "The Cozy Hideaway", href: "/glamping/cozy-hideaway/", meta: "14' × 15' · 210 + 98 sq ft" },
  },
  {
    label: "Outfit",
    href: "/gear/",
    primary: true,
    blurb: "Packing gear, sleep systems, frames, flys and tent accessories.",
    groups: [
      {
        heading: "Gear",
        links: [
          { label: "All gear", href: "/gear/" },
          { label: "Packing gear", href: "/gear/packing/" },
          { label: "Sleep systems", href: "/gear/sleep/" },
          { label: "Bags and carry", href: "/gear/carry/" },
        ],
      },
      {
        heading: "Tent accessories",
        links: [
          { label: "All accessories", href: "/accessories/" },
          { label: "Frames and poles", href: "/accessories/frames/" },
          { label: "Flys and awnings", href: "/accessories/flys-awnings/" },
          { label: "Deals and steals", href: "/deals/" },
        ],
      },
    ],
    featured: { label: "Big Boy Cot", href: "/gear/sleep/", meta: "7' × 2' 6\" · 18\" off the ground" },
  },
  {
    label: "Stoves",
    href: "/stoves/",
    blurb: "Wood-burning camp stoves sized to your tent.",
    groups: [
      {
        heading: "Stoves",
        links: [
          { label: "All stoves", href: "/stoves/" },
          { label: "Wood-burning camp stove", href: "/stoves/wood-burning-camp-stove/" },
          { label: "Rivers Bend stove", href: "/stoves/rivers-bend-stove/" },
          { label: "Pipe and parts", href: "/stoves/#parts" },
          { label: "Stove sizing tool", href: "/stoves/#sizing" },
        ],
      },
    ],
  },
  {
    label: "Guides",
    href: "/guides/canvas/",
    blurb: "Everything to know before you buy a canvas tent.",
    groups: [
      {
        heading: "Guides",
        links: [
          { label: "Canvas and treatment", href: "/guides/canvas/" },
          { label: "Standard features", href: "/guides/standard-features/" },
          { label: "Size finder", href: "/guides/size/" },
          { label: "Videos", href: "/guides/videos/" },
          { label: "Season dates", href: "/guides/season-dates/" },
          { label: "Journal", href: "/journal/" },
        ],
      },
    ],
  },
  {
    label: "About",
    href: "/about/",
    blurb: "Family-owned in Denver, Colorado since 1955.",
    groups: [
      {
        heading: "Company",
        links: [
          { label: "Our story", href: "/about/" },
          { label: "Made in Denver", href: "/about/made-in-denver/" },
          { label: "Conservation", href: "/about/conservation/" },
          { label: "Press", href: "/about/press/" },
          { label: "Reviews", href: "/reviews/" },
        ],
      },
      {
        heading: "Support",
        links: [
          { label: "FAQ", href: "/support/faq/" },
          { label: "Shipping", href: "/support/shipping/" },
          { label: "Returns", href: "/support/returns/" },
          { label: "Warranty", href: "/support/warranty/" },
          { label: "Contact and visit", href: "/contact/" },
        ],
      },
    ],
  },
];

export const footerLinks: NavGroup[] = [
  {
    heading: "Shop",
    links: [
      { label: "Hunting tents", href: "/hunting/" },
      { label: "Packages with stove", href: "/hunting/packages/" },
      { label: "Glamping tents", href: "/glamping/" },
      { label: "Stoves", href: "/stoves/" },
      { label: "Gear", href: "/gear/" },
      { label: "Accessories", href: "/accessories/" },
      { label: "Deals", href: "/deals/" },
      { label: "Gift certificates", href: "/gift-certificates/" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Canvas guide", href: "/guides/canvas/" },
      { label: "Standard features", href: "/guides/standard-features/" },
      { label: "Size finder", href: "/guides/size/" },
      { label: "Videos", href: "/guides/videos/" },
      { label: "Journal", href: "/journal/" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about/" },
      { label: "Made in Denver", href: "/about/made-in-denver/" },
      { label: "Conservation", href: "/about/conservation/" },
      { label: "Press", href: "/about/press/" },
      { label: "Reviews", href: "/reviews/" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "FAQ", href: "/support/faq/" },
      { label: "Shipping", href: "/support/shipping/" },
      { label: "Returns", href: "/support/returns/" },
      { label: "Warranty", href: "/support/warranty/" },
      { label: "Contact and visit", href: "/contact/" },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy", href: "/legal/privacy/" },
  { label: "Terms", href: "/legal/terms/" },
  { label: "Accessibility", href: "/legal/accessibility/" },
];
