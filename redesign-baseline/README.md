# Redesign baseline (Step 2)

I captured this baseline on 12 Nov 2026 from https://davistent.vercel.app, which was serving `main` at commit `eec1d62`. Run this command to capture it again, or to capture the "after" state:

```
node redesign-baseline/capture.mjs <baseUrl> redesign-baseline/<before|after>
```

The script drives headless Chrome over the DevTools protocol and needs no npm packages.

| Item | Result |
|---|---|
| Test suite | The project has no test suite. Running `tsc --noEmit` locally reports 69 errors, all from the local `next` package being incomplete (npm installs time out on this machine): 39 × TS2307 "cannot find module", 22 × TS18048 and others that follow from those. The Vercel build of `main` passes, and I use that as the build gate. |
| Screenshots | Full page at 390, 768 and 1440 px, capped at 16,000 px tall, for home, listing (`/tents/`), product (`/tents/wall/14x15/`), builder (`/build/`), glamping (`/glamping/`) and content (`/support/faq/`). The empty cart drawer is captured at 390 and 1440. |
| Rendered text | `<page>.txt` holds the `main` element's `innerText` at 1440 px, for the content diff. |
| SEO | `seo.json` records the title, meta description, canonical, every H1, JSON-LD, page height and canvas count for each page. |
| Routes | `routes.txt` lists 57 routes from `/sitemap.xml`. Redirects live in `src/content/redirects.ts`, which this work does not change. |
| Products | `products.json` records a count of 60 and the SHA-256 of `JSON.stringify(products)` from `src/content/catalog.ts`. |
| Lighthouse | Not measured. It is not installable locally, and PageSpeed Insights was declined (audit Q5). |

## Notes

- The homepage at 390 px was captured on the first visit, so the hero was in motion mode: a 400vh pinned scroll, cut off at the 16,000 px cap.
- Later visits in the same session show the collapsed hero with "Replay the intro". That is why the 768 and 1440 home captures and `home.txt` show that state.
- `home.txt` includes the hidden "About the Raising Camp introduction" scene summary. CR-07 removes it along with the hero.

## Folders and scripts added during the work

| Path | What it holds |
|---|---|
| `before/` | The baseline described above |
| `after/` | The same capture from a local production build of the finished branch |
| `compare/index.html` | Twelve screens side by side, before and after (final state) |
| `compare-p1/index.html` | The same comparison as it stood after the P1 change requests |
| `capture.mjs` | Full-page screenshots, rendered text, SEO tags, routes, product hash |
| `viewports.mjs` | One-screen JPEG shots used by the comparison pages |
| `checks.mjs` | Layout and motion checks on 12 pages at 320, 390, 768, 1024, 1280 and 1440 px, plus reduced motion |
| `a11y.mjs` | axe-core WCAG 2.2 AA scan (install `axe-core` with `npm install --no-save axe-core` first) |
