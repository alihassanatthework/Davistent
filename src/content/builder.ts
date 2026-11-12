/**
 * Custom tent builder options and rules (Roadmap ch. 14 "The custom tent builder";
 * Rule model, ch. 18). Price adders that the audit recorded are used as found;
 * adders marked `estimate: true` were not published and must be replaced by the
 * live WooCommerce add-on data proven in the Phase 1 spike.
 */
export type Option = {
  id: string;
  label: string;
  price: number;
  note?: string;
  estimate?: boolean;
};

export type BuilderSize = { id: string; w: number; l: number; base: number; fireBase: number; sleeps: string; estimate?: boolean };

/**
 * Base prices are the low end of each published range (water and mildew).
 * Fire-treated bases and the 8x10 / 10x10 figures are NOT published and are
 * placeholders until the store add-on data is read (Phase 1 spike).
 */
export const builderSizes: BuilderSize[] = [
  { id: "8x10", w: 8, l: 10, base: 869, fireBase: 1000, sleeps: "1", estimate: true },
  { id: "10x10", w: 10, l: 10, base: 950, fireBase: 1100, sleeps: "1-2", estimate: true },
  { id: "10x15", w: 10, l: 15, base: 1137, fireBase: 1320, sleeps: "1-2" },
  { id: "12x15", w: 12, l: 15, base: 1376, fireBase: 1590, sleeps: "1-3" },
  { id: "14x15", w: 14, l: 15, base: 1576, fireBase: 1820, sleeps: "3-4" },
  { id: "14x20", w: 14, l: 20, base: 1821, fireBase: 2100, sleeps: "4" },
  { id: "16x20", w: 16, l: 20, base: 1952, fireBase: 2250, sleeps: "6" },
  { id: "16x25", w: 16, l: 25, base: 2278, fireBase: 2630, sleeps: "8" },
];

export const treatments: Option[] = [
  { id: "untreated", label: "Untreated", price: -100, note: "Not recommended for long-term setups.", estimate: true },
  { id: "water-mildew", label: "Water and mildew", price: 0, note: "Our recommendation." },
  { id: "fire", label: "Water, mildew and fire", price: 0, note: "CPAI-84. Required for CA, LA, MA, MI, MN, NY, NJ and Canada." },
];

export const colours: Option[] = [
  { id: "natural", label: "Natural white", price: 0 },
  { id: "autumn-gold", label: "Autumn Gold", price: 0, note: "Fire-treated canvas only; upcharge applies.", estimate: true },
];

export const openings = {
  stoveJack: [
    { id: "jack-55", label: "5.5\" stove jack, inside left", price: 0, note: "Standard" },
    { id: "jack-4", label: "4\" stove jack", price: 0 },
    { id: "jack-6", label: "6\" stove jack", price: 0 },
    { id: "jack-none", label: "No stove jack", price: 0 },
  ] satisfies Option[],
  windows: [
    { id: "win-0", label: "No extra windows", price: 0 },
    { id: "win-2", label: "Two extra screened windows", price: 138 },
  ] satisfies Option[],
  extras: [
    { id: "screen-door", label: "Screened door", price: 0, note: "Price from store add-on", estimate: true },
    { id: "colorado-door", label: "Colorado door", price: 0, note: "Price from store add-on", estimate: true },
  ] satisfies Option[],
};

export const frameOptions: Option[] = [
  { id: "frame-none", label: "No frame (I will cut poles or use logs)", price: 0, note: "Ridge and eave sleeves accept a 1\" pipe or a 12\" log." },
  { id: "angles-only", label: "Angle kit only (cut list for local 1\" EMT)", price: 180, estimate: true },
  { id: "internal", label: "Complete internal frame", price: 650, estimate: true },
  { id: "traditional", label: "Traditional galvanized pole system", price: 260, note: "Can be packed on horseback.", estimate: true },
];

export const floorOptions: Option[] = [
  { id: "floor-none", label: "No floor", price: 0 },
  { id: "floor-34", label: "3/4 detached floor", price: 180, estimate: true },
  { id: "floor-full", label: "Full detached floor", price: 220, estimate: true },
  { id: "floor-sewn", label: "Sewn-in floor", price: 260, estimate: true },
];

export const flyOptions: Option[] = [
  { id: "fly-none", label: "No fly", price: 0 },
  { id: "fly-poly", label: "12 mil poly-coated nylon fly", price: 0, estimate: true },
  { id: "fly-vinyl", label: "14 oz vinyl-coated ripstop fly", price: 0, estimate: true },
  { id: "fly-canvas", label: "10.10 oz Sunforger canvas fly", price: 0, estimate: true },
];

export const fireStates = ["CA", "LA", "MA", "MI", "MN", "NY", "NJ"] as const;

export const destinations = [
  { id: "", label: "Choose a destination" },
  ...[
    "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
  ].map((s) => ({ id: s, label: s })),
  { id: "CANADA", label: "Canada" },
];

export type Build = {
  size: string;
  treatment: string;
  colour: string;
  destination: string;
  stoveJack: string;
  windows: string;
  extras: string[];
  frame: string;
  floor: string;
  fly: string;
};

export const defaultBuild: Build = {
  size: "14x15",
  treatment: "water-mildew",
  colour: "natural",
  destination: "",
  stoveJack: "jack-55",
  windows: "win-0",
  extras: [],
  frame: "frame-none",
  floor: "floor-none",
  fly: "fly-none",
};

export type RuleResult = { id: string; level: "block" | "warn" | "info"; message: string; fix?: Partial<Build> };

/** Rules from the current site, enforced as the buyer goes. */
export function checkRules(b: Build): RuleResult[] {
  const out: RuleResult[] = [];
  const needsFire = (fireStates as readonly string[]).includes(b.destination) || b.destination === "CANADA";
  if (needsFire && b.treatment !== "fire") {
    out.push({
      id: "fire",
      level: "block",
      message: "We cannot ship tents to CA, LA, MA, MI, MN, NY, NJ or Canada without the FIRE treatment.",
      fix: { treatment: "fire" },
    });
  }
  if (b.floor === "floor-sewn" && (b.frame === "internal" || b.frame === "angles-only")) {
    out.push({
      id: "sewn-floor",
      level: "block",
      message: "A sewn-in floor is not compatible with an internal frame or angle kit.",
      fix: { floor: "floor-full" },
    });
  }
  if (b.colour === "autumn-gold" && b.treatment !== "fire") {
    out.push({ id: "gold", level: "block", message: "Autumn Gold is available on fire-treated canvas only.", fix: { treatment: "fire" } });
  }
  if (b.stoveJack === "jack-4") {
    out.push({ id: "jack", level: "warn", message: "Davis stoves need a 5.5\" or larger stove jack." });
  }
  if (b.treatment === "untreated") {
    out.push({ id: "untreated", level: "info", message: "Water and mildew treatment is our recommendation." });
  }
  return out;
}

export function priceBuild(b: Build) {
  const size = builderSizes.find((s) => s.id === b.size) ?? builderSizes[4];
  const find = (list: Option[], id: string) => list.find((o) => o.id === id);
  const lines: { label: string; price: number; estimate?: boolean }[] = [];
  const base = b.treatment === "fire" ? size.fireBase : size.base;
  lines.push({ label: `${size.w}' × ${size.l}' wall tent`, price: base, estimate: b.treatment === "fire" || size.estimate });
  const pick = [
    find(treatments, b.treatment),
    find(colours, b.colour),
    find(openings.stoveJack, b.stoveJack),
    find(openings.windows, b.windows),
    ...b.extras.map((e) => find(openings.extras, e)),
    find(frameOptions, b.frame),
    find(floorOptions, b.floor),
    find(flyOptions, b.fly),
  ].filter(Boolean) as Option[];
  for (const o of pick) if (o.price !== 0 || o.estimate) lines.push({ label: o.label, price: o.price, estimate: o.estimate });
  const total = lines.reduce((s, l) => s + l.price, 0);
  return { size, lines, total, hasEstimates: lines.some((l) => l.estimate) };
}

export const encodeBuild = (b: Build) =>
  new URLSearchParams(
    Object.entries(b).map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : String(v)]),
  ).toString();

export function decodeBuild(q: URLSearchParams): Build {
  const b = { ...defaultBuild };
  for (const k of Object.keys(b) as (keyof Build)[]) {
    const v = q.get(k);
    if (v == null) continue;
    if (k === "extras") b.extras = v ? v.split(",") : [];
    else (b as Record<string, unknown>)[k] = v;
  }
  return b;
}

/** Tents over 16' × 25' hand off to a quote at the per-square-foot FAQ rates. */
export const customRate = { waterMildew: 2.95, fire: 3.63, minArea: 320 };
