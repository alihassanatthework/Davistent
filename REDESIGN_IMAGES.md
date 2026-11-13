# Image decision list (CR-22)

**Status:** the project has no photographs. `public/` is empty, and the plan's rule against stock images means none were sourced.

**Update:** at the owner's request the earlier line drawings are back in the homepage hero, the four camp tiles, the canvas band, the standard-features block and the glamping band, as stand-ins until photographs arrive. The category page headers show them too (desktop only, via the `scene` prop on `PageHeader`). Only the hot-tents band stays without drawings.

Every other slot that needs a photograph shows a flat Charcoal or Gunmetal placeholder. Where an image component exists, it is ready to take the file once Davis Tent supplies it.

**Decisions:**
- **Keep:** the current asset stays.
- **Needed:** the client must supply a photograph, and a placeholder is shown until then.
- **Removed:** a decorative drawing was taken out.

## Hero, bands and headers

| Slot | Where in code | Before | Now | Decision | Brief for the photograph |
|---|---|---|---|---|---|
| Homepage hero | `components/home/Hero.tsx` (`photo` constant) | Procedural canvas animation | Flat Charcoal | **Needed** | Real Davis wall tent in hunting country at dusk or dawn, snow or frost, stove pipe smoking, lit from inside. Landscape ≥ 2400 px plus a portrait crop. No posing. |
| Canvas band (home 5) | `app/page.tsx`, section `h-canvas` | CSS weave and droplet stand-in | Flat Gunmetal | **Needed** | Macro of Sunforger-treated army duck, ideally with water beading |
| Standard features (home 6, tent pages) | `components/home/FeatureHotspots.tsx` | Wall-tent drawing with hotspots | Flat Charcoal | **Needed** | One pitched wall tent, three-quarter view, showing the stove jack and door |
| Hot tents and stoves (home 8) | `app/page.tsx`, section `h-hot` | 3 × stove drawing | **Removed** (data cards only) | **Needed** | Steel stove in use inside a tent: fire, pipe, steel plate |
| Glamping for business (home 10) | `app/page.tsx`, section `h-b2b` | Glamping drawing | Flat Charcoal | **Needed** | Glamping tent on a deck, exterior first |
| Made in Denver (home 11) | `app/page.tsx`, section `h-denver` | No image | No image | **Needed** | Shop floor: hands, machines, canvas rolls (people working, not posing) |
| Category headers (tents, specialty, hunting, packages, accessories, frames, flys and awnings, gear, gear subpages, stoves, build, glamping and three glamping subpages, deals, gift certificates, support and contact) | `components/layout.tsx PageHeader` (`image` prop) | Decorative drawing on a coloured ground | Flat Charcoal band | **Needed**, one per category | Category-specific: hunt camp; tent interior; frames and poles; fly over a tent; packing gear on canvas; stove close-up; glamping exterior |

## Shop-by-camp tiles (CR-04)

| Slot | Where | Now | Decision |
|---|---|---|---|
| Hunt / Glamp / Outfit / Stoves tiles | `components/home/CampCards.tsx` (`photo` field per tile) | Flat Charcoal tiles with the capital label; drawings removed | **Needed**: hunt camp; glamping tent at dusk; packing gear on canvas; stove close-up |

## Kept as they are

| Slot | Why |
|---|---|
| Product card, quick view and product gallery drawings (`TentIllustration` via `ProductCard`, `CategoryGrid`, `ProductPage`) | These are product images, which the plan says not to change. They are placeholders for the product photography the earlier roadmap already flagged. |
| Glamping guide labelled drawing (`/glamping/guide/`) | A technical diagram with an accessible label that carries information |
| Size-finder floor plan, modular diagram, builder preview, frame chooser | Diagrams that carry specifications and update with the controls |

## Rules applied

- No CSS filters on images. Any grading (the plan's ~10% desaturation) belongs in the supplied file.
- The only gradient is the photo scrim, and it renders only when a photograph is present.
- Every new photograph needs descriptive alt text. Purely decorative ones get empty alt text.
- Product photographs on Olive grounds are avoided. The plan's usage rule says photographs sit on Charcoal or white, while CR-25 puts glamping bands on Olive. The homepage glamping slot is a Charcoal frame inside the Olive band. **Open question for the client.**
