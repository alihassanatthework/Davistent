# Redesign changes: masculine refinement (CR-01 to CR-27)

Step 16 of the *Masculine Redesign & Animation Refinement Plan*.

- **Branch:** `redesign/masculine-refinement`, cut from `main` at `eec1d62`.
- **Size of the change:** 54 source files, 897 lines added and 1,723 removed.
- **Not touched:** `src/content/` and `src/lib/` (product data, facts, redirects, commerce, form actions).

Companion files:
- [REDESIGN_AUDIT.md](REDESIGN_AUDIT.md): what the build looked like before the work.
- [REDESIGN_IMAGES.md](REDESIGN_IMAGES.md): the image decision list.
- [redesign-baseline/](redesign-baseline/): baseline and final captures, plus the check scripts.
- [redesign-baseline/compare/index.html](redesign-baseline/compare/index.html): before and after, side by side.

## Status

All 27 change requests are implemented. Three verifications could not be run from this project:
- **Lighthouse:** not measured, by your decision (audit Q5). Weight and script size were measured directly instead.
- **Test order with coupon, gift certificate and donation:** checkout is WooCommerce's, outside this repository, and there is no staging store.
- **Tag debugger for analytics:** the build has no analytics or pixel code, so there is nothing to compare.

Every photo-led request is built but shows a flat placeholder, because the project contains no photographs.

## Change requests

Each row is one commit, apart from the small follow-up commits listed with it. "How checked" refers to the scripts in `redesign-baseline/`, run against a local production build of the branch.

| ID | Commit | Files | What was done | How the acceptance criteria were checked |
|---|---|---|---|---|
| CR-01 Colour tokens | `abf965f`, `8d9c22f` | `globals.css`, 21 components | The palette replaced the old tokens in the one token file. Old role names (`pine`, `canvas`, `ember`…) now point at the new values so components did not churn. Added `data-surface` dark, light and accent, which set text, muted text, border, link, eyebrow and focus-ring colours. Autumn Gold removed. | Grep finds no hex literal in components outside SVG drawings, apart from the `themeColor` metadata value. Axe reports 0 contrast violations on 7 templates at 390 and 1440 px; the old site had 12. Orange remains only on primary buttons, links on dark, the sale flag, the footer rule and the Call band. |
| CR-02 Typography | `27a56e8`, `9b97ea7`, `28f5692`, `cc23442` | `layout.tsx`, `globals.css`, `Logo.tsx`, `BuyBox.tsx` | Fraunces replaced by Barlow Condensed 600/700 through `next/font` (self-hosted, Latin, swap, size-adjusted fallback). Only Barlow is preloaded. Type scale per the plan, in capitals through CSS. | No Fraunces request in the build. The content diff shows text unchanged apart from case as rendered. No clipped heading at 320 px on 12 pages. CLS not measured (no Lighthouse); the header and hero have fixed heights. |
| CR-03 Homepage bands | `ae567b0` | `page.tsx`, `ui.tsx`, `globals.css` | Band map applied: Forest canvas story, Charcoal stoves, Olive glamping, Gunmetal Made in Denver, white and Bone for shopping. Section padding 80/48 px. | Section order and text are identical in the content diff. No texture or gradient remains (grep). |
| CR-04 Camp tiles | `923003b` | `CampCards.tsx` | Tiles are photo tiles with a bottom scrim and a capital label: 4:5, 3:4 on tablet, 2 × 2 on mobile. | Same four links. Motion is only the image zoom to 1.04 and the 4 px arrow shift. The scrim and label contrast apply once photographs exist; today the tiles are flat Charcoal. |
| CR-05 Static feature sections | `fb4ccd1` | `FeatureHotspots.tsx`, `SizeFinder.tsx` | Standard features became a numbered list of all seven with spec and detail. The size guide opens with a static table of size, sleeps and price; the selector still swaps the recommendation instantly. The modular diagram already swapped instantly. | Content diff: every size, sleeps and feature value is still present, and all seven feature details are now visible at once. Nothing in these sections animates. Controls are native inputs and unchanged. |
| CR-06 Trust strip | `8cc6573` | `TrustStrip.tsx`, `page.tsx` | Gunmetal strip under the hero with four items. | Each item traces to `facts.origin`, `facts.madeInUsa` (tents only), `facts.sunforgerUs` and `site.phone`. One row from 1024 px. Hero buttons stay above the fold at 390 × 844. |
| CR-07 Hero | `59df7c9` | `Hero.tsx` (new), `page.tsx`, `globals.css`, `next.config.ts`; deleted `hero/*` | The scroll sequence was replaced by a static hero with the existing H1, eyebrow and buttons. The entrance is five CSS rules, at rest by 600 ms. | Check script: 0 canvas elements, one H1, no scroll listener apart from the header's. Reduced motion: hero opacity 1 with a 0.01 ms duration. One viewport of scroll reaches the tiles. LCP not measured (no Lighthouse); with no photograph the LCP element is the H1 text. |
| CR-08 Scroll-driven animation | `1c1a405` | `package.json`, `Header.tsx`, `layout.tsx`, `globals.css` | GSAP uninstalled. The header no longer shrinks on scroll. | Grep for `scrub`, `pin:` and `animation-timeline` returns nothing. The only scroll listener hides and shows the header. |
| CR-09 Playful effects | `717dae0` | `FeatureHotspots.tsx`, `primitives.tsx` | Removed the 1.10 and 1.05 hover scales. The pulsing bar went with the hero. | Grep for `infinite`, `spring`, `bounce`, `elastic`, `back.out`, `overshoot` and `animate-` returns nothing. No Lottie or Rive. |
| CR-10 Category headers | `64ea457` | `layout.tsx`, 16 page files | Headers are 220 px on mobile and 320 px on desktop, flat Charcoal, with breadcrumb, capital H1 and the existing intro. The decorative drawing is removed. An `image` prop with a 400 ms reveal is ready. | At 1440 × 900 the first product row is visible on load (screenshot). H1 and intro text are unchanged in the content diff. |
| CR-11 Motion tokens | `4483c11` | `globals.css`, `primitives.tsx`, 5 components | Plan tokens added. Reveal is 8 px, 240 ms, 40 ms stagger capped at four items, through one shared observer. Global reduced-motion block. | The check script reads computed styles on 12 pages: nothing over 400 ms except the hero rules, no delay over 280 ms. With reduced motion the worst duration is 0.01 ms and no reveal stays hidden. |
| CR-12 Header | `67c4245` | `Header.tsx`, `Cart.tsx`, `globals.css` | Solid Charcoal on every page, 56/72 px fixed, condensed capital navigation with a 180 ms underline, phone number in Tan. | Navigation links and order come from the unchanged `site.ts`. No blur, transparency or shadow. Focus ring is the global 2 px Blaze outline. |
| CR-13 Menus | `9a8a757` | `Header.tsx`, `globals.css` | Gunmetal mega menu with Tan column headings and a 180 ms open; Charcoal mobile sheet with Call and Email at the bottom. | Same link data. Disclosure, Escape and focus-return code untouched. No per-item stagger. |
| CR-14 Listings and filters | `056754e` | `CategoryGrid.tsx` | Squared 18 px checkboxes, capital count and sort, 24 px gap, Charcoal compare bar, active-filter tags. | Filter logic and URL parameters are untouched. The new tags call the existing toggle functions. Results update instantly with no reflow animation. |
| CR-15 Product cards | `1fcd700` | `ProductCard.tsx` | White card, capital condensed title, mono data line, bold price, text action, sale price in Blaze Deep. | One component serves home, listing, related and the fallback list. Data shown is unchanged. Hover is zoom to 1.04 and border colour only. The card shows a Blaze ring on keyboard focus. |
| CR-16 Product pages | `6483ed4` | `ProductPage.tsx`, `BuyBox.tsx` | 36 px capital title, squared options with a Charcoal selected state, gallery on white, 56 px buy button, origin statement in one Charcoal band. | Option, pricing and rule code untouched. Product JSON-LD is identical in the SEO diff. No scroll-linked animation. |
| CR-17 Builder | `4f71fca` | `TentBuilder.tsx`, `ui.tsx` | Numbered capital steps over a 2 px progress rule, Charcoal price summary, plain rule boxes with a coloured left border. | Pricing, rules, share links and cart payload code untouched. The preview already swapped instantly. A scripted five-build comparison was not run, since no pricing code changed. |
| CR-18 Banners | none | — | Nothing to change. The build has no announcement bar, sale banner, rotation or countdown. The Call band was restyled under CR-01 and CR-19. | At most one promotional band per page; it does not animate. |
| CR-19 Buttons | `187d555` | `ui.tsx`, 7 components | One shared button style: Blaze primary with a Charcoal label, 1.5 px outline secondary that follows its surface, capital text tertiary, 80 ms press, 4 px arrow shift. About 20 hand-written buttons now use it. | The mobile action bar's Shop button was demoted so the hero keeps the only primary. Label contrast 4.88:1 at rest and 4.57:1 on hover. |
| CR-20 Forms | `4606842` | `forms.tsx`, `SignupForm.tsx`, 5 others | Inputs are 48 px, 2 px radius, 1 px Slate border, with 13 px bold labels. | Names, validation and actions untouched. Slate on white is 7:1. |
| CR-21 Radius, shadows, textures | `ea6554c` | `globals.css`, 14 components | Radius token 2 px. Pills squared. Shadows only on overlays. Weave texture removed. | Grep: no `rounded-full`, `rounded-lg` or larger. Shadows remain only on the search list and the toast (overlays). |
| CR-22 Imagery | `9a229f0` | `REDESIGN_IMAGES.md` | Image decision list per slot. No drawing remains in the hero, headers or bands. | Product drawings untouched. |
| CR-23 Cart drawer | `8ce990a` | `Cart.tsx` | Charcoal header strip on a white drawer, one Blaze checkout button. | Cart and checkout hand-off code untouched. The staging test order was not possible. |
| CR-24 Footer | `b7a8aef` | `Footer.tsx`, `Logo.tsx` | Charcoal footer, Blaze top rule, Tan column headings, Ash legal row, one-colour badge. | Links come from the unchanged `site.ts`. The copyright year is still generated. |
| CR-25 Glamping | `9128d5e` | `layout.tsx`, `globals.css`, one page | Glamping routes use an Olive header and Bone bands. | Only palette tokens used. Disclaimers and forms unchanged. Built as the lighter variant, per your default. |
| CR-26 Content pages | `34f14a7` | `globals.css`, 3 components | Tables get Charcoal header rows. Content pages inherit the Charcoal title strip and a 680 px column. | FAQ text is identical in the content diff. The accordion is native buttons. |
| CR-27 Tags and icons | `33073f8` | `ui.tsx`, 4 components | Tags are 2 px rectangles in 11 px capitals. Icons use a 1.75 px stroke with square caps. Decorative check and info icons became small square markers. | No pill remains. Remaining icons are inside controls or beside a text label. |

Step 14 (`af869aa`) fixed horizontal overflow at phone widths on the homepage, product page and builder. Step 15 (`a3948f1`) fixed two contrast findings.

## Verification results

| Check | Result |
|---|---|
| Typecheck and production build | 0 errors; the build passes locally and on Vercel |
| Content diff, 6 pages | Listing, glamping and FAQ are identical. Homepage: hero scene text removed; trust strip, size table and feature details added. Product: hotspot labels replaced by the numbered list. Builder: step numbers now read 01 to 06. |
| SEO diff | Titles, descriptions, canonicals, H1s and JSON-LD identical on 6 pages. 57 routes identical. `redirects.ts` unchanged. |
| Products | 60 products; SHA-256 `621d36e42a25…` identical |
| Motion scan | No animation library. No scroll-linked code apart from header show and hide. No loop. Nothing over 400 ms except the hero entrance. |
| Layout, 12 pages × 6 widths | No horizontal overflow, no clipped heading, one H1, no canvas |
| Reduced motion | Nothing animates |
| Accessibility (axe, WCAG 2.2 AA, 7 pages × 2 widths) | 0 violations; the old site had 12 |
| Homepage weight | First-load JavaScript 208.8 KB → 198.6 KB gzipped. Preloaded fonts 115.8 KB → 29.7 KB. |
| Keyboard pass | Not run by hand. Menu, dialog, filter and form behaviour code is unchanged. |

## Deleted assets and removed dependencies

| Item | Size |
|---|---|
| `src/components/hero/RaisingCamp.tsx`, `draw.ts`, `scenes.ts` | 1,175 lines, 41 KB of source |
| `gsap` 3.15.1 | 6.4 MB installed; no longer in the client bundle |
| Fraunces font | No longer downloaded or preloaded |
| Hero frame images | None existed |

No dependency was added to the project. `axe-core` was installed without saving it, for the scan only.

## Small additions that are not in the original copy

These are interface labels, not content edits:
- "View" on product cards, hidden from screen readers.
- "Recommended" in the size table, so the highlighted row is not shown by colour alone.
- The trust strip's four short labels.
- "Remove filter", for screen readers, on active-filter tags.
- The signup form's existing "Email address" label is now visible.

## Skipped or different from the plan

- **Hero supporting sentence and new headline:** not used. They need client approval, so the existing H1 and buttons stay.
- **Hero photo desaturation:** not applied in CSS, because CR-22 allows no filters. Grade the supplied file instead.
- **Three font families** (Barlow Condensed, Inter, JetBrains Mono) against the plan's cap of two, per your default.
- **Product rails** kept as swipe rails, per your default.
- **Search box label** stays visually hidden; the field has a search icon and a button.
- **Review stars** kept beside the rating heading, recoloured Olive.
- **Photographs on Olive:** the plan's palette rule and CR-25 disagree. The homepage glamping photo slot is a Charcoal frame inside the Olive band.
- **Order of work:** CR-07 was done before CR-08 so the GSAP removal could follow the hero's deletion.
- `package-lock.json` exists locally and is not committed, as before this work.

## Section 16 checklist

| Item | State |
|---|---|
| Homepage opens on a photograph of a hunt camp | **Blocked:** no photograph exists. It opens on a static Charcoal hero, not an animation. |
| One scroll reaches categories | Done |
| Nothing bounces, floats, pulses, loops or tells a story | Done |
| Dark, strong, structured; product pages easy to read | Done |
| Bold condensed capitals; no serif | Done |
| Orange only on primary action, links on dark, sale flag | Done, plus the plan's own footer rule and Call band |
| Motion limits, hero under 700 ms, no scroll-linked behaviour, hover limits, reduced motion, library removed | Done |
| Colours from tokens; contrast passes | Done |
| Radius 2 px or 0; no card shadows, textures or decorative gradients | Done |
| One button, card and field style | Button and card: done. Fields share one style, applied in several components. |
| Band map followed | Done |
| Photographs are real; no renders in hero, headers or bands | No drawings remain there; photographs are still needed |
| Product data, rules, claims, routes, SEO identical | Done |
| Cart, checkout, coupon, gift certificate, donation, forms work | Code untouched; not tested end to end |
| Analytics events | None exist in the build |
| Responsive items at 320 to 1440 px | Done by script; portrait and landscape on real phones not tested |
| LCP and CLS | Not measured |
| Transfer and script size lower | Done |
| Keyboard path | Not run by hand |
| Focus ring visible; no new WCAG issues | Done |
| Audit, changes, screenshots, open questions, one commit per request | Done |

## Open questions for the client

1. Approve the proposed hero headline and supporting sentence, or keep the existing H1.
2. Approve the plan's hero buttons ("Shop hunting tents", "Tent packages with stove"), or keep "Shop tents" and "Build your tent".
3. Supply the hunt-camp hero photograph, landscape and portrait, or approve a shoot.
4. Supply photographs for the four camp tiles, the dark bands and each category header. The list is in REDESIGN_IMAGES.md.
5. Supply product photography; cards and galleries still show line drawings.
6. Confirm the lighter Olive glamping variant, or ask for dark.
7. Supply the master logo file; the wordmark in the header is a placeholder drawing.
8. Decide whether photographs may sit on Olive bands.
9. Name any page or animation in the feedback that is not covered here.
10. The About, guides, journal and reviews pages linked from the menus are not built yet.
