# Redesign audit: masculine refinement

Step 1 of the *Masculine Redesign & Animation Refinement Plan* (v1.0, 12 Nov 2026).
Written on branch `redesign/masculine-refinement` before any code change.
"Plan" means the Refinement Plan PDF; "build" means this repository as it stands at `eec1d62`.

---

## 1. Stack

| Item | Found |
|---|---|
| Framework | Next.js 16.4.6, App Router, React 19.3, TypeScript 5 |
| Styling | Tailwind CSS v4.3.3 (`@tailwindcss/turbopack`), with CSS custom properties in one file and a `@theme inline` block that exposes them as utilities |
| Animation library | `gsap` 3.15.1 (with ScrollTrigger), used **only** by the hero. Its package is 6.4 MB in `node_modules`, loaded in the browser with a dynamic `import()` |
| CMS | None. Content is TypeScript records in `src/content/*.ts` (`catalog`, `facts`, `features`, `builder`, `site`, `support`, `chips`, `redirects`) |
| Commerce | `src/lib/commerce.ts` reads the WooCommerce Store API when the `WC_*` environment variables are set, and falls back to the seed catalogue otherwise. The cart is a client context (`Cart.tsx`). **Checkout is not in this front end**: the cart hands off to the WooCommerce checkout URL. Coupons, gift-certificate redemption and donations live there. |
| Forms | Server actions in `src/lib/actions.ts`: contact, enquiry, signup and gift certificate |
| Tests | **None.** There is no test runner and no test script. `package.json` has only `dev`, `build`, `start` and `typecheck`. |
| Run | `npm run dev` |
| Build | `npm run build` (Vercel builds every push to `main` and serves https://davistent.vercel.app) |
| Check | `npm run typecheck` (locally: `node node_modules/typescript/bin/tsc --noEmit`) |
| Local toolchain | npm installs time out on this machine. `node_modules` is partial: TypeScript works, `next` is incomplete, there are no `.bin` links. A local `next build`/`dev` is not possible, so Vercel is the build check. Lighthouse is not installed. |

---

## 2. Design tokens: `src/app/globals.css`

Every token lives in `:root` and is mapped to Tailwind utilities in `@theme inline`. Components use the utilities (`bg-pine`, `text-stone` and so on). Nothing else defines tokens.

### Colour, current values

| Token (CSS var → utility) | Value | Role in the build | Plan role it maps to |
|---|---|---|---|
| `--color-pine` → `pine` | #1F3A2E | Brand bands, secondary buttons, links on light, focus ring, selected chips, footer ground | color-brand → becomes #141615 (Forest kept separately) |
| `--color-charcoal` → `charcoal` | #1C1F1E | Body text, dark bands | color-text / ink → #141615 |
| `--color-canvas` → `canvas` | #F4EEE2 | Page background, header, mega menu | color-bg → #ECE7DC (Bone) |
| `--color-army-duck` → `duck` | #C9B48A | Badge tint, selection | Canvas Tan #C9B48A (unchanged) |
| `--color-ember` → `ember` | #D9601A | Rule lines on dark | color-accent → Blaze #D9601A |
| `--color-ember-deep` → `ember-deep` | #C4530F | Primary button fill, orange band, cart count, sale badge | color-accent-deep → #C4530F |
| `--color-autumn-gold` → `gold` | #C8922B | Review stars, one badge tone, modular awning stroke | color-accent-2 → **remove** |
| `--color-stone` → `stone` | #6B6F6A | Secondary text | color-text-muted → Slate #555A55 |
| `--color-stone-deep` → `stone-deep` | #5F635E | Secondary text, eyebrows | → Slate #555A55 |
| `--color-snow` → `snow` | #FFFFFF | Cards, text on dark | White for cards; **Bone** for text on dark (no pure white text on dark) |
| `--color-surface-alt` → `surface-alt` | #E3DCCB | Alternate band | → #DDD8CC |
| `--color-border` → `line` | #CFC6B2 | Every hairline border | → #CFCAC0; plus new `border-dark` #3D4447 and `edge` #6F7773 |
| `--color-leather` → `leather` | #6B4423 | Unused | → Saddle #6B4F3A |
| `--color-success` / `warning` / `error` | #2E6B4A / #B7791F / #B3261E | Status | Keep warning and error (they match the plan); success → Forest |

**Missing tokens** that the plan needs: gunmetal, steel, edge, forest (separate from the brand role), olive, ash, slate, border-dark.

**No dark/light surface mechanism exists.** Dark sections add an ad-hoc `.on-dark` class, which changes only the focus-ring colour. Text colour is set per instance (`text-snow`, `opacity-80`).

### Type, radius, shadow and motion

| Group | Current |
|---|---|
| Display font | `--font-display: Fraunces` (serif), applied to `h1`, `h2` and `.font-display`. Weight 600, tracking −0.01em, sentence case |
| Body / mono | Inter; JetBrains Mono (`.data` utility, tabular numbers) |
| Type scale | h1 `clamp(36px…56px)`/1.1; h2 `clamp(26px…36px)`/1.17; h3 `clamp(19px…22px)`/1.25; body `clamp(16px…17px)`/1.6; eyebrow 13 px, +8% tracking |
| Radius | `--radius-sm: 2px`, `--radius-md: 4px`. Tailwind `rounded-md` resolves to the 4 px token, so changing one token covers most corners. Separate literals: 12 × `rounded-full` (pills) and 1 × `rounded-t-md` |
| Shadow | `--shadow-1: 0 1px 2px rgba(28,31,30,.08)`, `--shadow-2: 0 8px 24px rgba(28,31,30,.14)` |
| Motion | `--duration-fast 150ms`, `--duration-base 300ms`, `--duration-slow 600ms`, `--ease-out cubic-bezier(.22,1,.36,1)`, `--ease-in-out cubic-bezier(.65,0,.35,1)`, `--reveal-distance 16px`, `--stagger 60ms`. Components mostly use Tailwind literals (`duration-300`, `duration-150`) rather than the tokens. |
| Spacing | `section-y`: 56 px mobile, 96 px desktop. `container-site`: max 1280 px, 16/24 px gutter |
| Textures | `canvas-weave` utility: two repeating linear gradients on the Canvas colour. Used by `Section tone="canvas"` (the **default** tone, so most sections) and `/build/` |
| Header height | `--header-h: 72px`; the header animates to 56 px on scroll |

### Hard-coded colours outside the token file

There are 107 hex literals in 17 files.

**Inline SVG drawings** (mostly allowed by the plan as "SVG assets"):
- `hero/draw.ts` (39): deleted with the hero.
- `TentBuilder.tsx` preview (22)
- `SizeFinder.tsx` floor plan (14)
- `ModularDiagram.tsx` (7)
- `TentIllustration.tsx` (6)
- `Logo.tsx` (1)

**Non-SVG literals, to replace with tokens:**
- `ui.tsx`: primary hover #A9470C, Notice grounds #FBF3E4 and #FBECEA.
- `page.tsx`: canvas weave stand-in and a water-droplet radial gradient.
- `layout.tsx`: packing header #3A2A1C.
- `CampCards.tsx`: #EFE2C2.
- `SignupForm.tsx`
- `CategoryGrid.tsx`
- `GiftForm.tsx`
- `BuyBox.tsx`
- `FrameChooser.tsx`
- `app/layout.tsx`: `themeColor` #1F3A2E.

---

## 3. Fonts loaded

Fonts load through `next/font/google` in `src/app/layout.tsx`. They are self-hosted at build, Latin subset, `display: swap`, with automatic size-adjusted fallbacks.

| Family | Use | Weights / axes | Preloaded |
|---|---|---|---|
| **Fraunces** (serif) | Display: h1, h2, `.font-display` | Variable, `opsz` axis | Yes (default) |
| Inter | Body, h3 and below, UI | Variable | Yes |
| JetBrains Mono | `.data`: specs, prices | Variable | No (`preload: false`) |

The plan's change for CR-02: replace Fraunces with **Barlow Condensed 600/700** through the same `next/font/google` call, then remove Fraunces. Inter and JetBrains Mono stay.

> **Conflict:** the plan's Section 14 caps fonts at "two families and four files". Its Section 5 also says to keep the mono font "if already in use", and it is. Keeping Barlow Condensed, Inter and JetBrains Mono is **three families**. My default is to keep all three, with only Barlow Condensed preloaded. The alternative is to drop JetBrains Mono and set `.data` in Inter with tabular figures.

---

## 4. Animation inventory

Decision key, per plan Sections 8 and 9:
- **Remove**: delete the code.
- **Shorten**: bring to plan values.
- **Keep**: already within the rules.

| # | File | What animates | Trigger | Duration / easing | Library | Decision |
|---|---|---|---|---|---|---|
| A1 | `hero/RaisingCamp.tsx`, `hero/draw.ts`, `hero/scenes.ts` | "Raising Camp": 8 scenes drawn procedurally on `<canvas>` inside a 700 vh desktop / 400 vh mobile wrapper with a `position: sticky` inner. Per-scene text fades and 16 px rises; pack items slide ±60 px; DOM layers are moved by inline styles each frame | Scroll (ScrollTrigger `scrub: 0.3`) | Scroll-scrubbed | GSAP + ScrollTrigger | **Remove** (CR-07, CR-08) |
| A2 | `RaisingCamp.tsx` | Four hero hotspots scale 0.8 → 1 as they appear | Scroll | Scrubbed | GSAP progress | **Remove** (CR-07) |
| A3 | `RaisingCamp.tsx:347` | "Lagging" indicator bar, `animate-pulse` (infinite) | Slow draw | Infinite | Tailwind | **Remove** (CR-09) |
| A4 | `RaisingCamp.tsx:368, 377` | Scene summary lines, `transition-[opacity,transform] duration-300` | Scroll | 300 ms | CSS | **Remove** with the hero |
| A5 | `RaisingCamp.tsx` | Session replay logic (`dt-hero-seen`, `dt-hero-lowpower` in sessionStorage), "Skip intro", "Play the full intro", "Replay the intro", stills mode, hidden `HeroSummary` | Load | n/a | — | **Remove** (CR-07: drop skip-intro, keep skip-to-content) |
| A6 | `globals.css .reveal` + `primitives.tsx Reveal` | Opacity 0 → 1, `translateY(16px)` → 0, stagger `--i × 60ms`, unbounded index | IntersectionObserver, once, **one observer per element** | 600 ms, ease `(.22,1,.36,1)` | CSS + IO | **Shorten**: 240 ms, 8 px, 40 ms stagger capped at 4, one shared observer at 15% (CR-11). Used on homepage popular rail, canvas facts, hot-tent cards and Made-in-Denver cards |
| A7 | `Header.tsx:89` | Header hide/show `-translate-y-full`; background-colour and height change | Scroll direction / position | 300 ms, Tailwind `ease-out` | CSS | **Shorten** hide/show to 200 ms. **Remove** the height shrink (72 → 56) and the transparent-to-solid change (CR-12: fixed height, opaque) |
| A8 | `Header.tsx:93` | Inner row height transition | Scroll | 300 ms | CSS | **Remove** (fixed height) |
| A9 | `Header.tsx:118` | Mega-menu chevron rotates 180° | Click | 150 ms | CSS | **Keep** (rotation of a control icon is functional) |
| A10 | `Header.tsx` mega menu | Panel shown or hidden instantly | Click | 0 | — | **Shorten up**: the plan allows a 180 ms opacity and −4 px rise; instant also complies. Keep instant unless a fade is wanted |
| A11 | `Header.tsx:231` | Mobile-sheet accordion chevron `group-open:rotate-180` | Click | Tailwind default 150 ms | CSS | **Keep** |
| A12 | `ProductCard.tsx:21, 25` | Card `hover:shadow-2` (300 ms); illustration `scale-[1.03]` (300 ms) | Hover | 300 ms | CSS | **Shorten**: shadow becomes border colour at 150 ms; scale 1.04 at 300 ms on the image only (CR-15) |
| A13 | `CampCards.tsx:23, 26` | Tile `hover:shadow-2`; illustration scale 1.03 | Hover | 300 ms | CSS | **Replace** per CR-04: scrim tile, image 1.04 at 300 ms, arrow 4 px at 150 ms |
| A14 | `FeatureHotspots.tsx:27` | Seven hotspot buttons, `hover:scale-110` | Hover | 150 ms | CSS | **Remove** (CR-05: numbered list beside one photograph; scale 1.10 exceeds 1.04) |
| A15 | `primitives.tsx:128` | Video play button `group-hover:scale-105` | Hover | Tailwind default | CSS | **Shorten** to colour change only (scale over 1.04) |
| A16 | `primitives.tsx:92` | Rail previous/next `scrollBy({behavior: "smooth"})`, off under reduced motion | Button click | Browser native | JS | **Keep**: native scroll in response to a click, not a smooth-scroll library |
| A17 | `globals.css .rail` | Horizontal `scroll-snap-type: x mandatory` on product rails | Swipe | — | CSS | **Keep**: snap inside a horizontal rail, not between page sections (the plan forbids the latter) |
| A18 | `ui.tsx:7` Button | `transition-colors duration-150 ease-out` | Hover | 150 ms | CSS | **Keep** duration; switch easing to the token; add 80 ms press (CR-19) |
| A19 | `ModularDiagram.tsx` | SVG parts appear or disappear on chip toggle | Click | Instant | — | **Keep**: already instant (CR-05 allows up to a 200 ms fade) |
| A20 | `SizeFinder.tsx`, `TentBuilder.tsx` preview | Floor plan and builder line drawing update on input | Input | Instant, no transition | — | **Keep**: already instant. The plan expected draw-on effects; there are none |
| A21 | `Cart.tsx` drawer, `CategoryGrid.tsx` dialogs, `Header.tsx` mobile sheet | Native `<dialog>` open/close | Click | Instant | — | **Keep** (instant complies) |
| A22 | `Cart.tsx:154` toast | Appears instantly | Add to cart | Instant | — | **Keep** |
| A23 | `globals.css` reduced-motion block | Zeroes motion tokens and animation duration | Media query | — | — | **Shorten up** to the plan's block: also transition-duration, transition-delay and `.reveal` reset |
| A24 | `layout.tsx PageHeader` (`category-scene` class) | **Nothing.** The comment says "scroll-linked scene", but no CSS rule targets `.category-scene`, so the illustration is static | — | — | — | Remove the decorative illustration (CR-10, CR-22); fix the comment |

Searches run, per plan Step 1:
- `infinite`, `spring`, `bounce`, `elastic`, `back.out`, `overshoot`: no matches in application code. `animate-pulse` (A3) is the only infinite loop.
- `animation-timeline`, `scroll-timeline`, `useScroll`, `parallax`: none.
- `scrub` and `pin:` appear only in `RaisingCamp.tsx` (and `pin` as an icon name in `ui.tsx`).
- Scroll listeners: `Header.tsx` (keep, show/hide only) and the GSAP ScrollTrigger (remove).
- Lottie, Rive, Lenis, Framer Motion, AOS, Swiper, Embla: none.
- Durations of 500 ms or more: only `--duration-slow: 600ms` (used by `.reveal`).

**Dependencies to remove after CR-07/CR-08:** `gsap` (the only animation dependency). That leaves zero animation libraries.

---

## 5. The hero

| Item | Found |
|---|---|
| Component | `src/components/hero/RaisingCamp.tsx`, rendered as section 1 of `src/app/page.tsx` |
| Imports | `./draw` (`drawProcedural`, `ImageSequence`, `VH`, `VW`, `Manifest`), `./scenes` (`scenes`, `heroHotspots`, `packItems`), `../TentIllustration`, `gsap` and `gsap/ScrollTrigger` (dynamic) |
| Page-level code | `page.tsx` reads `public/hero/manifest.json` from disk (`heroManifest()`) and passes it in. `next.config.ts` has a `/hero/:path*` cache-header rule |
| Frame assets | **None exist.** `public/` is empty. With no manifest the hero draws every frame procedurally on the canvas, so there are no frame images or hotspot JSON to delete. The plan's "about 276 frames, about 7 MB" does not apply to this build |
| Code weight | `RaisingCamp.tsx` 18.2 KB, `draw.ts` 18.2 KB, `scenes.ts` 4.5 KB (41 KB of source), plus GSAP and ScrollTrigger in the client bundle |
| H1 | "Canvas Tents, Glamping Tents & Camping Gear" (from `scenes[0].heading`). This is the text kept by default |
| Eyebrow | "Handcrafted in Denver, Colorado Since 1955" (`facts.origin`) |
| Current buttons | "Shop tents" → `/tents/`; "Build your tent" → `/build/` |
| Hero-only content elsewhere | Scenes 2–8 carry headings, copy and hotspot text that appear only inside the animation. Removing the hero removes that text from the homepage. Most of those facts also appear in the homepage sections below (canvas, features, stoves, glamping, pack gear); see Q3 |
| Also used by | `CampCards` has a `compact` prop used only by hero scene 8. The `Header` "transparent over the homepage hero" state is used only by the hero |

---

## 6. Shared components

| Component | Path | Notes |
|---|---|---|
| Header, mega menu, mobile sheet | `src/components/Header.tsx` | Fixed. Transparent on the home page at the top, otherwise `bg-canvas/95 backdrop-blur`. Shrinks on scroll. Mobile menu is a `<dialog>` with `<details>` accordions and Call/Email buttons at the bottom |
| Footer | `src/components/Footer.tsx` | Pine ground, `<details>` link columns (all open), newsletter, socials, legal row, `MadeInUsaMark` |
| Logo | `src/components/Logo.tsx` | Inline SVG placeholder using `currentColor`, so it already works on dark. **Not the client's master logo file** |
| Button / ButtonLink | `src/components/ui.tsx` | Variants: `primary` (ember-deep fill, white label), `secondary` (pine outline), `tertiary` (text and arrow), `inverse` (snow outline). **About 20 instances bypass it** with hand-written classes: `layout.tsx` TalkToUs and MobileActionBar, `Header.tsx` sheet buttons, `SizeFinder`, `StoveSizer`, `BuyBox`, `CategoryGrid` quick view, `SignupForm` |
| Section band | `ui.tsx Section`, tones `canvas` (weave texture, default), `pine`, `charcoal`, `snow`, `alt`, `ember` | This is the right place for the CR-01 surface attribute |
| SectionHead | `ui.tsx` | Eyebrow, H2 and intro |
| Badge (tag) | `ui.tsx Badge` | `rounded-sm` (already 2 px); tones duck, ember, pine, gold, stone |
| Notice | `ui.tsx` | Left-border message box; used for builder rules |
| Product card | `src/components/ProductCard.tsx` | One component used by the home rails, category grid, Suspense fallback and related products |
| Category header | `src/components/layout.tsx PageHeader` | `min-h-[52vh]`, `md:min-h-[60vh]`, with an `accent` colour per category and an optional decorative `TentIllustration`. Used by every listing and content page |
| Category chips | `layout.tsx CategoryChips` | `rounded-full` pills |
| Talk-to-us band | `layout.tsx TalkToUs` | Ember-deep band with white text and two hand-written buttons |
| Mobile action bar | `layout.tsx MobileActionBar` | Fixed bottom bar, canvas/95 with blur |
| Fields | `src/components/forms.tsx Field` (contact, enquiry), plus separate inputs in `SignupForm`, `GiftForm`, `SiteEstimator`, `TentBuilder`, `BuyBox` and `CategoryGrid` | There is no single shared input; CR-20 needs a shared class |
| Accordion, Rail, Reveal, LiteYouTube | `src/components/primitives.tsx` | |
| Spec table | `ui.tsx SpecTable` | |

---

## 7. Image slots (CR-22)

**There is not a single photograph in the project.** `public/` is empty. Every image on the site is a schematic SVG line drawing (`TentIllustration`, 12 kinds) or a CSS stand-in. Product cards and product galleries also use the drawings.

| Slot | Current asset | Decision |
|---|---|---|
| Hero | Procedural canvas drawing | **Needed**: client hunt-camp photo, landscape and portrait. Until then: flat Charcoal placeholder, flagged |
| Shop-by-camp tiles ×4 (Hunt, Glamp, Outfit, Stoves) | Line drawings on coloured grounds | **Needed** (4 photos). Placeholder: flat Charcoal tile with scrim and label |
| Canvas band (homepage 5) | CSS weave and droplet stand-in | **Needed**: canvas macro. Remove the stand-in (gradient texture) |
| Standard features (homepage 6) | Wall-tent drawing with hotspots | **Needed**: one wall-tent photo. The numbered list carries the facts |
| Modular (homepage 7) | Inline SVG diagram that carries the add-on information | **Keep** as a technical diagram, restyled to tokens |
| Hot tents and stoves (homepage 8) | 3 × stove drawing | **Needed**: steel-and-fire photo. Drop the decorative drawings |
| Glamping band (homepage 10) | Glamp drawing | **Needed**: tent-on-deck photo |
| Made in Denver (homepage 11) | No image | **Needed**: shop-floor photos |
| Category headers: tents, specialty, hunting, packages, accessories, frames, flys, gear, gear/[sub], stoves, build, glamping and 3 glamping subpages | Decorative drawing (desktop only) | **Needed** per category. Until supplied: flat Charcoal header with the H1 (CR-10) |
| Product cards and product galleries | Line drawings | **Keep as they are.** The plan says not to touch product images. These are placeholders for product photography that the earlier roadmap already flagged; flagged again |
| Glamping guide (`/glamping/guide/`) | Labelled glamping drawing (`label=` set, so it carries information) | **Keep** as a technical diagram |
| Size finder floor plan, builder preview, frame chooser | SVG diagrams that carry the data | **Keep** |

---

## 8. Homepage: the build compared with the plan's band map

The build has 14 rendered blocks for the plan's 16 sections: 12+13 and 14+15 are already combined, as the plan shows them. The order matches the plan.

| # | Section | Build tone now | Plan band |
|---|---|---|---|
| 1 | Hero | Pine / canvas drawing | Dark (photo) |
| — | Trust strip | Does not exist | Gunmetal (new, CR-06) |
| 2 | Shop by camp | canvas + weave | Light (Bone) |
| 3 | Most popular | snow | Light (white) |
| 4 | Size finder | canvas + weave | Light (Bone) |
| 5 | The canvas | **charcoal** | **Forest** |
| 6 | Standard features | canvas + weave | Light (white) |
| 7 | Modular | snow | Light |
| 8 | Hot tents and stoves | **pine** | **Charcoal** |
| 9 | Specialty | canvas + weave | Light (Bone) |
| 10 | Glamping for business | alt | **Olive** (CR-25) |
| 11 | Made in Denver | **snow** | **Gunmetal** |
| 12–13 | Reviews and Conservation | canvas + weave | White |
| 14–15 | Guides and Deals signup | snow, with a pine signup panel | Bone |
| 16 | Call or shop | ember-deep, white text | Blaze, **Charcoal text** |
| — | Footer | pine | Charcoal |

---

## 9. Where the build contradicts the plan's "expected" descriptions

1. **No photographs at all** (Section 7 above). Every photo-led request (CR-03, CR-04, CR-07, CR-10, CR-22, CR-25) will land with flat Charcoal placeholders until the client supplies images. This changes how the result will look far more than the plan anticipates.
2. **Hero frames do not exist.** The canvas is drawn procedurally, so there are no 7 MB of frames to delete. The weight saved is 41 KB of source plus GSAP in the client bundle.
3. **Category headers are not animated.** The plan expected eleven scroll-linked scenes; the build shows one static decorative drawing per header. CR-10 is still needed for height (60 vh → 320/220 px) and the decorative-art rule.
4. **No About page, timeline, canvas guide, journal pages or guide pages are built.** Footer and menu links to them return 404 today. CR-26's timeline and scroll explainer have nothing to act on; it applies to the support, FAQ, returns, shipping, warranty, contact and glamping-guide pages that do exist.
5. **No announcement bar, sale banner, rotating message or countdown exists.** CR-18 applies only to the Call-or-shop band, the deals signup panel and the donation line. The donation prompt is in the cart and on homepage section 13, not on a conservation page, which isn't built.
6. **Checkout is WooCommerce's, outside this repository.** CR-23 covers only the cart drawer here. There is no staging store, so the test order with coupon, gift certificate and donation (Step 15) cannot be run from this project.
7. **The builder and size-finder previews already swap instantly.** There are no draw-on, morph or stagger effects (CR-17 and CR-05 motion already comply). Only their colours and pill shapes need work.
8. **Product detail pages have no scroll "anatomy" tour or 360° view.** CR-16 is a restyle and reorder only.
9. **Filters have no price slider.** Filters are selects and checkboxes; results update instantly with no reflow animation (CR-14 motion already complies).
10. **The logo is an inline SVG placeholder using `currentColor`**, so it already renders correctly on dark. There is no raster to invert. The client's master logo is still outstanding.
11. **There is no test suite** and no local build or Lighthouse (npm timeouts). See the Step 2 plan below.
12. **The hero buttons in the plan differ from the build.** The plan specifies "SHOP HUNTING TENTS" / "TENT PACKAGES WITH STOVE"; the build has "Shop tents" → /tents/ and "Build your tent" → /build/. Changing labels or links is a content edit, so the default is to keep the existing ones (Q2).
13. **Header shrink.** The build shrinks 72 → 56 px on scroll. CR-12 requires a fixed height, so the shrink is removed and the hide-on-scroll-down behaviour is kept.
14. **Trust strip claims** all trace to existing records:
    - SINCE 1955: `facts.origin`.
    - TENTS MADE IN THE USA: `facts.madeInUsa`, "All our tents are proudly built in the USA…", which is tents-scoped.
    - SUNFORGER® TREATED CANVAS: `facts.sunforgerUs`.
    - The phone number: `site.phone`.

    `facts.ts` still lists "whether Made in the USA applies to every product line" as an open question. The strip wording keeps the claim scoped to tents.

---

## 10. Brand claims and strings that must not change

These are recorded for the Step 15 diff:
- **Founding and origin:** 1955 and "Handcrafted in Denver, Colorado Since 1955".
- **Family-owned:** `facts.familyOwned`.
- **Made in USA:** `facts.madeInUsa` (tents) and the "Made in Denver" badge, which appears on wall, package, specialty and glamping cards only.
- **Sunforger®:** `sunforgerUs`, `sunforgerButler`.
- **Tagline:** "Quality | Innovation | Trust".
- **Phone and email:** `site.phone` (877) 355-2267, and `site.email`.
- **Unresolved facts:** facility size, canvas weight and warranty wording stay exactly as they are in `facts.ts`.

Catalogue: 44 records with an `id:` field in `src/content/catalog.ts`. Redirects: `src/content/redirects.ts`.

---

## 11. Plan for Step 2 (baseline), given the constraints

- **Tests:** none exist, so I record "no suite" and run typecheck as the gate.
- **Screenshots and text:** the in-app browser against https://davistent.vercel.app (`main` = `eec1d62`) at 390, 768 and 1440 px.
  - Pages: home, `/tents/` (listing), `/tents/wall/14x16/` (product), `/build/`, `/glamping/`, cart drawer, `/support/faq/`.
  - Visible text is saved per page to `redesign-baseline/`.
- **SEO:** for each page, title, meta description, canonical, H1 and JSON-LD scraped from the deployed HTML. The route list comes from `/sitemap.xml`, plus a copy of `redirects.ts`.
- **Lighthouse:** not installable locally. I can run PageSpeed Insights (public web service) against the deployed URL, or skip and report. **Needs your OK, because it sends the site URL to Google.**
- **Product data:** a count and SHA-256 hash of `catalog.ts` exports, computed with Node.
- **Branch previews:** Vercel builds a preview URL for the branch on push, which gives the "after" pages.

---

## 12. Proposed token mapping for Step 3

Existing names are kept so components don't churn, per plan Section 13. New names are added for the plan's palette.

| Utility now | New value | Note |
|---|---|---|
| `canvas` | #ECE7DC (Bone) | Page surface |
| `charcoal` | #141615 (Ink) | |
| `pine` | #141615 for the brand, link and outline role | Pine-filled bands move to explicit `forest`, `ink` or `gunmetal` tones through the Section surface prop |
| `ember` / `ember-deep` | #D9601A / #C4530F | Restricted to primary action, links on dark and the sale flag |
| `gold` | removed | Stars and badge go to `tan`; awning stroke goes to `olive` |
| `stone` / `stone-deep` | #555A55 (Slate) | |
| `duck` | #C9B48A (Tan) | Also exposed as `tan` |
| `line` | #CFCAC0 | |
| new | `gunmetal` #2A2F31, `steel` #3D4447, `edge` #6F7773, `forest` #1F3A2E, `olive` #5A5F3A, `saddle` #6B4F3A, `bone` #ECE7DC, `ash` #A9ADA6, `slate` #555A55, `blaze` #D9601A, `blaze-deep` #C4530F, `border-dark` #3D4447 | |
| `radius-md` | 2px | Pills (`rounded-full`) become 2 px rectangles |
| `shadow-1` / `shadow-2` | none / `0 8px 24px rgba(20,22,21,.28)` (overlays only) | |

A `data-surface="dark"` attribute on `Section`, `PageHeader`, the header and the footer will set the text, muted-text, border and link tokens for everything inside.

---

## 13. Questions that change scope

| # | Question | Default if you don't answer |
|---|---|---|
| Q1 | No photos exist anywhere. Proceed with flat Charcoal placeholders in every photo slot and flag them all? | Yes, placeholders and flags |
| Q2 | Hero buttons: keep the existing "Shop tents" / "Build your tent", or use the plan's "Shop hunting tents" → /hunting/ and "Tent packages with stove" → /hunting/packages/ (a copy and link change)? | Keep existing |
| Q3 | Removing the hero removes the scene 2–8 text, which appears only inside the animation. Most of those facts repeat lower on the page. Accept the loss? | Yes. The plan's content diff exempts the hero |
| Q4 | Fonts: keep three families (Barlow Condensed, Inter, JetBrains Mono) against the plan's two-family cap? | Keep three; preload only Barlow Condensed |
| Q5 | Run PageSpeed Insights on the public Vercel URL for the Lighthouse baseline? | Skip, and report Lighthouse as not measured |
| Q6 | The homepage section-3 rail and section-9 rail are swipe rails with arrow buttons. The plan's CR-15 says "card row". Keep the rails (restyled)? | Keep rails |
