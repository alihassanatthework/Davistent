/**
 * Standard features on every Davis wall tent (Feature model, ch. 18).
 * Reused by the homepage hotspots, guide page, product pages and hero scene 4.
 * Hotspot x/y are percentages over the TentIllustration "wall" drawing.
 */
export type Feature = {
  id: string;
  name: string;
  spec: string;
  detail: string;
  source: string;
  hotspot: { x: number; y: number };
};

export const standardFeatures: Feature[] = [
  {
    id: "walls",
    name: "5' walls (cut size)",
    spec: "Walls are cut at five feet and will finish at 4' 8\".",
    detail: "Tall walls give usable floor space right to the edge for cots and gear.",
    source: "/standard-features-davis-wall-tents/",
    hotspot: { x: 20, y: 62 },
  },
  {
    id: "zipper",
    name: "Zippered door",
    spec: "Heavy-duty #10 YKK coil zipper.",
    detail: "A screen door receiver is standard, so a screen door can be added at any time.",
    source: "/standard-features-davis-wall-tents/",
    hotspot: { x: 50, y: 66 },
  },
  {
    id: "stove-jack",
    name: "5.5\" stove jack",
    spec: "Standard location is inside left as you enter. Two layers of fiberglass cloth. 4\", 5\" or 6\" available.",
    detail: "The jack can be moved to another location for no additional charge.",
    source: "/standard-features-davis-wall-tents/",
    hotspot: { x: 28, y: 30 },
  },
  {
    id: "sod-cloth",
    name: "Attached sod cloth",
    spec: "A 10-inch band sewn in around the inside of the tent at the bottom.",
    detail: "Keeps drafts, snow and critters out where the wall meets the ground.",
    source: "/standard-features-davis-wall-tents/",
    hotspot: { x: 80, y: 86 },
  },
  {
    id: "sleeves",
    name: "Ridge and eave sleeves",
    spec: "Accept a 1\" pipe or a 12\" log.",
    detail: "Pitch on a frame or cut poles on site.",
    source: "/standard-features-davis-wall-tents/",
    hotspot: { x: 62, y: 14 },
  },
  {
    id: "ropes",
    name: "Pre-cut ropes",
    spec: "Steel stamped tensioners. No knots required.",
    detail: "Ropes arrive cut to length so the tent goes up quickly.",
    source: "/standard-features-davis-wall-tents/",
    hotspot: { x: 92, y: 52 },
  },
  {
    id: "stakes",
    name: "Steel stakes",
    spec: "12-inch for ropes and 10-inch for the tent bottom, in their own bag.",
    detail: "Steel holds in frozen ground where plastic fails.",
    source: "/standard-features-davis-wall-tents/",
    hotspot: { x: 8, y: 90 },
  },
];

/** Modular add-ons, defined from the FAQ (homepage section 7). */
export const modules = [
  { id: "cook-shack", name: "Cook shack", detail: "A separate canvas room that can stand alone or link to the main tent.", href: "/tents/specialty/cook-shack/" },
  { id: "fly", name: "Rain fly", detail: "A second roof over the ridge for sun, rain and snow load.", href: "/accessories/flys-awnings/" },
  { id: "awning", name: "Awning", detail: "Extends from the front wall to make a covered porch. Integrated, detached or sewn on.", href: "/accessories/flys-awnings/" },
  { id: "floor", name: "Floor", detail: "3/4 detached floor, full floor or sewn-in floor options.", href: "/accessories/" },
] as const;
