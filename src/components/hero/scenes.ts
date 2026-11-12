/**
 * Raising Camp storyboard (Roadmap ch. 10–12). Scroll ranges are fractions of
 * the pinned hero. All headline text is HTML placed over the canvas, never
 * baked into frames, and is taken from the current site.
 */
export type Scene = {
  id: number;
  name: string;
  start: number;
  end: number;
  eyebrow?: string;
  heading: string;
  lines?: string[];
  smallPrint?: string;
  ctas?: { label: string; href: string; variant?: "primary" | "inverse" }[];
  /** Rendered frame counts from the asset budget (desktop / mobile; 0 = DOM scene or cross-fade). */
  frames: { desktop: number; mobile: number };
  mobile: boolean;
  align: "left" | "right" | "center";
};

export const scenes: Scene[] = [
  {
    id: 1,
    name: "First Light",
    start: 0,
    end: 0.1,
    eyebrow: "Handcrafted in Denver, Colorado Since 1955",
    heading: "Canvas Tents, Glamping Tents & Camping Gear",
    ctas: [
      { label: "Shop tents", href: "/tents/" },
      { label: "Build your tent", href: "/build/", variant: "inverse" },
    ],
    frames: { desktop: 24, mobile: 24 },
    mobile: true,
    align: "left",
  },
  {
    id: 2,
    name: "The Canvas",
    start: 0.1,
    end: 0.24,
    eyebrow: "The canvas",
    heading: "Built from cotton army duck",
    lines: [
      "10 oz. double-fill cotton army duck",
      "Sunforger® treatment is only applied in the United States",
      "Highly resistant to moisture, mildew, UV damage",
    ],
    ctas: [{ label: "The canvas guide", href: "/guides/canvas/", variant: "inverse" }],
    frames: { desktop: 48, mobile: 48 },
    mobile: true,
    align: "left",
  },
  {
    id: 3,
    name: "The Frame",
    start: 0.24,
    end: 0.38,
    eyebrow: "Frames and poles",
    heading: "A frame for every camp",
    lines: ["Internal frames suit long-term setups. Traditional poles pack smaller and weigh about half as much."],
    ctas: [{ label: "Frames and poles", href: "/accessories/frames/", variant: "inverse" }],
    frames: { desktop: 48, mobile: 0 },
    mobile: false,
    align: "left",
  },
  {
    id: 4,
    name: "The Wall Tent",
    start: 0.38,
    end: 0.54,
    eyebrow: "Canvas wall tents",
    heading: "Standard on every wall tent",
    ctas: [{ label: "Standard features", href: "/guides/standard-features/", variant: "inverse" }],
    frames: { desktop: 56, mobile: 56 },
    mobile: true,
    align: "left",
  },
  {
    id: 5,
    name: "Hot Tent",
    start: 0.54,
    end: 0.68,
    eyebrow: "Hunting tent packages with stove",
    heading: "Hot Tents: Canvas Wall Tent + Wood Burning Stove",
    lines: ["Turkey · Antelope · Elk · Elk Plus · Grizzly · Bison"],
    ctas: [
      { label: "Shop packages", href: "/hunting/packages/" },
      { label: "Shop stoves", href: "/stoves/", variant: "inverse" },
    ],
    frames: { desktop: 52, mobile: 30 },
    mobile: true,
    align: "left",
  },
  {
    id: 6,
    name: "Glamping",
    start: 0.68,
    end: 0.82,
    eyebrow: "Luxury Glamping Tents",
    heading: "The same canvas, dressed for guests",
    lines: ["The Cozy Hideaway 14' × 15'", "The Oasis Retreat 16' × 20'", "The Summit Ridge 16' × 25'"],
    smallPrint: "Glamping tents do not include furniture or deck.",
    ctas: [
      { label: "Shop glamping", href: "/glamping/" },
      { label: "Plan a project", href: "/glamping/for-business/resorts/", variant: "inverse" },
    ],
    frames: { desktop: 48, mobile: 30 },
    mobile: true,
    align: "right",
  },
  {
    id: 7,
    name: "Pack In",
    start: 0.82,
    end: 0.92,
    eyebrow: "Camping & Packing Gear",
    heading: "Tested and proven for decades in the field",
    ctas: [{ label: "Shop gear", href: "/gear/" }],
    frames: { desktop: 0, mobile: 0 },
    mobile: true,
    align: "center",
  },
  {
    id: 8,
    name: "Choose Your Camp",
    start: 0.92,
    end: 1,
    heading: "Choose your camp",
    frames: { desktop: 0, mobile: 0 },
    mobile: true,
    align: "center",
  },
];

/** Four hotspots in scene 4, positioned in the 1600 × 900 virtual frame. */
export const heroHotspots = [
  { id: "walls", label: "5' walls (cut size)", x: 640, y: 640 },
  { id: "stove-jack", label: "5.5\" Stove Jack – standard location is inside left", x: 1010, y: 470 },
  { id: "sod-cloth", label: "Attached Sod Cloth", x: 1060, y: 618 },
  { id: "zipper", label: "Heavy-duty #10 YKK coil zipper", x: 742, y: 640 },
];

export const packItems = ["Pack saddle panniers", "Pack saddle", "Cowboy bedroll", "Big Boy cot", "Rifle scabbard", "Stove bag"];
