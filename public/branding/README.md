# Brand assets

## Logo

| File               | Purpose                                           |
| ------------------ | ------------------------------------------------- |
| `logo-trimmed.png` | **The file the site renders** (900×442, ~449 KB). |

The un-trimmed 2.2 MB original artwork (1536×1024) is **not** committed — the
repo carries production-ready assets only. It's archived outside the repo.

### Why the file is "trimmed"

In the supplied artwork the ink only filled **74% of the canvas width and 54% of
its height** — the rest was transparent margin. Rendered at the navbar's ~48px
height, the visible logo would have been roughly **24px tall** and optically
off-centre. `logo-trimmed.png` is that _same artwork_ with the empty margin
cropped away and downscaled for the web. Nothing about the design was altered.

### Wiring

`src/config/site.ts` → `siteConfig.logo` is the single source of truth. `<Logo>`
picks the renderer from the file extension:

- **`.svg`** → rendered directly (crisp, unoptimised)
- **anything else** → `next/image` (optimised, high-DPI srcset)

Rendered size is CSS (`h-10 sm:h-12 w-auto`), so the aspect ratio is always
preserved. Set `siteConfig.logo` to `undefined` to fall back to the tree mark +
Bengali wordmark.

### Preferred: replace with an SVG

An **SVG would be better** than the PNG — a few KB and infinitely crisp. Because
`<Logo>` auto-detects the format, upgrading is a one-line change:

1. Save the vector as `public/branding/logo.svg`.
2. In `src/config/site.ts`, set `logo.src` to `"/branding/logo.svg"`.
3. Delete `logo-trimmed.png`.

No component changes required.

## Favicon

The browser-tab icon is `src/app/icon.svg` (the tree mark, literal brand
colors), served via the Next.js metadata-file convention. A raster
`src/app/apple-icon.png` (180×180) could be added later for iOS home screens.

## Other assets (future)

- `og-default.png` — 1200×630 Open Graph share image
- Once a vector logo exists, reconcile the token palette in
  `src/app/globals.css` against its exact colors.
