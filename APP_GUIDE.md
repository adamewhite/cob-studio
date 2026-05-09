# APP_GUIDE

Reference for working in this repo. Project context lives in `ABOUT.md`; this file is for *how the code is shaped*.

## Stack

- Next.js **16.2.4** (App Router) — see `AGENTS.md`: APIs may differ from training data, check `node_modules/next/dist/docs/` before touching Next-specific code.
- React 19.2.4
- Tailwind CSS v4 (via `@tailwindcss/postcss`) — config lives inline in `app/globals.css` using `@theme inline`, not a `tailwind.config.*` file.
- TypeScript 5, strict mode. Path alias `@/*` → repo root.
- No DB, no auth, no Stripe yet. Everything is static.

Scripts: `npm run dev`, `build`, `start`, `lint`.

## Routes

```
/                              app/page.tsx                     home: hero, new arrivals, collections
/about                         app/about/page.tsx               studio bio (placeholder copy)
/artwork                       app/artwork/page.tsx             all works grid
/artwork/[category]            app/artwork/[category]/page.tsx  paintings | drawings | sculpture
/artwork/[category]/[slug]     .../[slug]/page.tsx              detail page (carousel + buy panel)
/artwork/series/[series]       app/artwork/series/[series]/...  series view (currently: botanical)
```

Linked but not yet implemented: `/cart`, `/contact`, `/policies/{shipping,returns,privacy}`.

Dynamic segments use the Next 15+ async-params shape: `params: Promise<{...}>` and `await params` in the page body. Both dynamic routes ship `generateStaticParams` so the whole site prerenders.

## Data layer

All artwork data is in `app/lib/artwork.ts` — a typed in-memory list. There is no CMS or fetch layer.

- `Artwork` type: slug, title, category, optional series, medium, dimensions, year, price (whole dollars, not cents despite `formatPrice`'s param name), optional images, optional gradient fallback, optional `sold` flag.
- Categories: `paintings | drawings | sculpture`. Series: `botanical` (extensible — add to the `Series` union and `seriesList`).
- 12 botanicals are generated programmatically; remaining placeholders are hardcoded with `gradient` instead of `images` (renders a Tailwind gradient block as a stand-in).
- Helpers: `getArtwork`, `getArtworksByCategory`, `getArtworksBySeries`, `getCoverImage`, `formatPrice`.

When adding a real piece: drop image files in `public/images/artwork/<series-or-category>/`, add an `Artwork` entry with an `images` array. If no image yet, give it a `gradient` and `ArtworkCard` will render the placeholder.

## Components (`app/components/`)

- `Nav.tsx` — sticky top header, logo + Artwork dropdown (categories + series) + About + Cart. Server component.
- `Footer.tsx` — 4-col footer with shop links, studio links, newsletter form (form is non-functional). Server component.
- `ArtworkCard.tsx` — grid card. Falls back to gradient block when `images` is missing.
- `Carousel.tsx` — `"use client"`. Detail-page image gallery with prev/next + thumbnails.

`Nav` and `Footer` are mounted in `app/layout.tsx`; pages render inside `<main>`.

## Styling

- Body gradient + base typography set in `app/globals.css`.
- Two Google fonts wired via `next/font` in `layout.tsx`: Instrument Sans (`--font-sans`, body) and Proza Libre (`--font-display`, all headings + `.font-display`).
- Conventions in use: `max-w-7xl mx-auto px-6` page container, `aspect-[4/5]` for cards, `aspect-[4/3]` / `aspect-[3/2]` for hero/collection tiles, neutral palette (`stone-*`, `black/NN` opacity).

## Known issues / gotchas

These will bite if not fixed before deploying to a case-sensitive filesystem (Vercel/Linux):

1. **Logo path case.** `Nav.tsx:12` references `/images/cob.svg`; the file is `public/images/COB.svg`. Works locally on macOS, breaks on Linux deploys.
2. **`formatPrice` parameter is misnamed `cents`** but is actually called with whole dollars (`a.price`). The `Intl.NumberFormat` call treats the number as dollars, so output is correct — just rename the param.
3. **`Add to cart` button has no handler.** No cart state, no `/cart` route, no Stripe integration yet. Per `ABOUT.md`, Stripe is the assumed direction but not committed.
4. **Footer newsletter form has no `action` / handler.**
5. **Botanical image filenames contain spaces** (`Botanical Painting - 01 - Full.jpg`). `lib/artwork.ts` builds the URLs with `encodeURIComponent` so requests are URL-safe — keep that wrapper if you change the filename scheme.

## What's not built yet

Per `ABOUT.md`'s goals: viewing → about → purchase. Viewing and about are done in skeleton form. Purchase flow (cart, checkout, Stripe, order email, inventory/sold-out state beyond the `sold` flag) is entirely missing. SEO basics are in place (per-page `generateMetadata`, `metadataBase`, title template) but no `sitemap.ts`, `robots.ts`, or OG images yet.
