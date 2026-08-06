# Chayar Asroy — Project Handoff

Everything a new contributor (or a new conversation) needs to continue this
project. Reflects the state as of **4 August 2026**, re-audited against the
working tree and the live database on that date — every claim below was checked,
not assumed. Where something could not be checked (anything requiring real
pixels), it is called out as unverified rather than asserted.

---

## 1. What this is

The official public website **and CMS** for **Chayar Asroy (ছায়ার আশ্রয়)** — a
real, student-led nonprofit in **Dhaka, Bangladesh** supporting underprivileged
children through creativity, learning and community.

It is not a demo. It will be maintained for years by rotating student
volunteers, so every decision favours **boring, predictable, documented**
solutions over clever ones.

---

## 2. Current state

|                              | Status                                                              |
| ---------------------------- | ------------------------------------------------------------------- |
| Public homepage              | ✅ 8 sections, entirely CMS-driven                                  |
| Design system                | ✅ Complete + documented                                            |
| SEO surface                  | ✅ `generateSiteMetadata()`, `robots.ts`, `sitemap.ts`, `icon.svg`  |
| Backend platform (Supabase)  | ✅ Provisioned, migrations `0001`–`0011`, validated live            |
| CMS framework + 6 editors    | ✅ Validated end-to-end in the browser                              |
| Public site reading from CMS | ✅ Phase 5D — homepage, shell and programmes                        |
| **Programs archive**         | ✅ `/programs` + `/programs/[slug]` with per-programme galleries    |
| **Real programme content**   | ✅ 4 programmes imported verbatim from the Event Documentation PDF  |
| **Real impact figures**      | ✅ 80 children · 20 volunteers · 4 programmes                       |
| **Hero image from the CMS**  | ✅ `pages.hero_media_id` (migration `0011`) — see §6                |
| **Gallery**                  | ✅ Event-grouped `/gallery` + `/gallery/[slug]`; homepage rotates 4 |
| Other inner pages            | ❌ Our Journey, Stories, Get Involved, Contact                      |
| Photography                  | ⚠️ **19 event photos**; programme covers are still placeholders     |

**Repo:** `C:\Users\Acer\Documents\Project\Chayar asroy`
**Git:** branch `main`, in sync with `origin` →
`https://github.com/Adibreal/Chayar-asroy.git`.
Last commit `d6003c0` — _feat(programs): add programmes archive and connect hero
image to the CMS_.

> The remote is a **personal** GitHub account. Moving it to an org-owned
> account is a launch task (see §8).

**Validation — all green:**

```bash
pnpm lint         # ✅
pnpm typecheck    # ✅
pnpm build        # ✅ 22 routes — 8 static, 2 SSG (programs + gallery), 12 dynamic
pnpm exec prettier --check "**/*.{ts,tsx,md,json,mjs}"  # ✅
```

The build emits one warning: Next 16 deprecates the `middleware` file convention
in favour of `proxy`. See §9.

> 🔴 **`pnpm audit --prod` is no longer clean.** A new advisory landed since the
> last check: **`fast-uri` < 3.1.5, high** — host confusion via a backslash
> authority introducer ([GHSA-7p8r-x3mc-p8w7](https://github.com/advisories/GHSA-7p8r-x3mc-p8w7)),
> reached through `@hookform/resolvers > ajv > fast-uri`. No dependency of ours
> changed; the advisory did. Nothing in the repo passes user input to `fast-uri`
> (it is `ajv`'s URI parser for `$ref` resolution in JSON Schema), so this is not
> an active exploit path here — but it is production-reachable and should be
> closed with the project's existing override mechanism: add `fast-uri: ^3.1.5`
> to `overrides` in **`pnpm-workspace.yaml`** _and_ the mirrored `overrides`
> block in `package.json` (§9), then `pnpm install` and re-run the gate. Left
> unapplied deliberately — it changes the lockfile, so it belongs in its own
> commit rather than buried in a documentation update.

---

## 3. Stack

| Concern         | Choice                                                   |
| --------------- | -------------------------------------------------------- |
| Framework       | Next.js 16 (App Router, RSC), React 19                   |
| Language        | TypeScript 5.9 **strict** (+ `noUncheckedIndexedAccess`) |
| Styling         | Tailwind CSS v4 (CSS-first `@theme` tokens)              |
| UI primitives   | Radix (`radix-ui`), CVA for variants, lucide-react       |
| Motion          | `motion` (Framer Motion)                                 |
| Backend         | Supabase — Postgres + Auth + Storage                     |
| Forms           | React Hook Form + Zod (via `standardSchemaResolver`)     |
| Package manager | **pnpm only** (npm lockfile deliberately removed)        |

**Deliberate version pins:** TypeScript **5.x** and ESLint **9.x**, not the
newer 7/10 majors — `eslint-config-next@16` bundles `typescript-eslint@8`, which
supports those. Revisit when upstream bumps.

---

## 4. Repository map

```
src/
├── middleware.ts             session refresh + coarse /admin auth gate
├── app/
│   ├── layout.tsx            shell: Header + <main> + Footer
│   ├── page.tsx              public homepage
│   ├── programs/             page.tsx (archive) · [slug]/page.tsx (detail)
│   ├── gallery/              page.tsx (events) · [slug]/page.tsx (one event)
│   ├── not-found.tsx         public 404
│   ├── globals.css           the three token layers live here
│   ├── icon.svg              favicon (hand-authored tree mark)
│   ├── robots.ts sitemap.ts  generated SEO endpoints
│   ├── (admin)/admin/        protected CMS (force-dynamic)
│   ├── (auth)/admin/login/   login — SEPARATE group on purpose (see §6)
│   └── (dev)/showcase/       design-system showcase, 404s in production
├── components/
│   ├── ui/ layout/ typography/ brand/ motion/   design system (Phase 3A)
│   ├── navigation/ hero/ projects/ gallery/ testimonials/
│   │   impact/ volunteer/ contact/ cta/ sections/ media/   sections (3B)
│   └── admin/                CMS framework: layout, data, forms,
│                             feedback, dashboard, media, permissions
├── config/     env.ts (validated), site.ts (infrastructure only), admin-nav.ts
├── hooks/      use-media-query, use-prefers-reduced-motion
├── providers/  motion-provider (MotionConfig reducedMotion="user")
├── lib/        utils(cn, toLines/fromLines, formatEventDate), styles,
│               polymorphic, motion/, seo/,
│               supabase/ (client, server, public, middleware, admin, config),
│               permissions
├── server/     auth, db, repositories, actions, storage, shared, media-url
│   └── content/  site.ts · home.ts · programs.ts · gallery.ts · media.ts
│                 the PUBLIC read layer — every public page reads via here
├── assets/     decor/ — the official decorative artwork (WebP)
├── types/      database.ts (derived), database.generated.ts, content.ts
└── validation/ common, auth, media, content  (Zod — single source of truth)

supabase/migrations/  0001 foundation · 0002 content · 0003 RLS
                      0004 storage    · 0005 gallery fields
                      0006 gallery_items.updated_by (audit)
                      0007 human-readable consent refusal message
                      0008 impact_stats.icon
                      0009 programme story fields + gallery_items.program_id
                      0010 site_settings.campaign_media_id
                      0011 pages.hero_media_id (+ backfill out of jsonb)
supabase/seed.sql     idempotent starter data + placeholder homepage content

scripts/  validate-backend.mjs     seed, anon RLS, storage, consent gate
          validate-auth-roles.mjs  signed-in RLS per role, audit column
```

Both harnesses run against the live project and clean up after themselves:

```bash
node --env-file=.env.local scripts/validate-backend.mjs
node --env-file=.env.local scripts/validate-auth-roles.mjs <admin-email>
```

`src/types/database.generated.ts` is generated from the live schema and
`database.ts` derives its named aliases from it — so the two cannot drift, and
PostgREST embeds (`media:media_id(…)`) type-check. Regenerate after every
migration.

**Public routes built:** `/` (homepage) · `/programs` (archive) ·
`/programs/[slug]` (programme story) · `/gallery` (events) · `/gallery/[slug]`
(one event’s photographs).
`/programs/[slug]` is prerendered via `generateStaticParams()`, so every
published programme is static HTML. `/` carries `revalidate = 3600` — see the
gallery decision in §6.

**Admin routes built:** `/admin` (dashboard) · `/admin/pages` (homepage) ·
`/admin/programs` (+ `new`, `[id]`) · `/admin/stories` (+ `new`, `[id]`) ·
`/admin/gallery` · `/admin/media` · `/admin/settings`. Gallery and Media are
single-screen managers (panel-based), which is why they have no `new`/`[id]`
child routes.

### The programmes feature

| Surface            | Behaviour                                                                   |
| ------------------ | --------------------------------------------------------------------------- |
| Homepage           | Exactly **3** featured programmes + "Explore all programs" CTA              |
| `/programs`        | **Every** published programme — the complete archive, nothing hidden        |
| `/programs/[slug]` | Hero beside the facts, one continuous "Event overview", volunteers, gallery |

The three-card homepage cap is `getPrograms({ featuredOnly: true, limit: 3 })`
— enforced in code, so featuring a fourth programme in the CMS never changes
that layout. `/programs` passes no limit.

A programme's gallery is `gallery_items.program_id` pointing at the **existing
media library**: no second image store, and it inherits the child-safety consent
trigger, so an unconsented photograph cannot appear on a programme page either.
Attach images in the Gallery editor by setting their _Programme_.

**Docs:** `BOOTSTRAP.md` (fresh-conversation primer), `README.md`,
`DESIGN_SYSTEM.md`, `docs/ARCHITECTURE.md`, `docs/BACKEND.md`,
`docs/DATABASE.md`, `docs/CMS.md`.

---

## 5. Brand facts (not derivable from code — do not re-derive)

- **Instagram `@chayar.asroy` is login-walled.** All brand knowledge came from
  user-supplied logo + campaign posters. Never invent brand details.
- **Cobalt blue IS a core brand colour** (heavy in the posters), alongside
  marigold, forest green, orange, cream. The logo alone is warm-only — the
  broader system is warm **+ blue**.
- **Donations are IN-KIND, not monetary** — books, notebooks, clothes, toys,
  crayons. Collected via Dhaka agents / Pathao / Instagram inbox. **No payment
  gateway is needed.**
- **Real volunteer roles:** Graphic Designer, Content Writer, Planning &
  Logistics, Media & Documentation.
- **Voice:** warm, hopeful, dignity-first. Children are creators, never objects
  of pity.
- **Logo:** official artwork at `public/branding/logo-trimmed.png`
  (900×442, cropped + downscaled from the supplied 1536×1024). The un-trimmed
  2.2 MB original is intentionally **not** in the repo.

---

## 6. Key design decisions (and why)

**Design tokens, three layers.** Primitives → semantic aliases → Tailwind
`@theme`. Components consume _semantic_ tokens only (`bg-background`,
`text-primary`), so dark mode (already scaffolded via `.dark`) and the CMS's
calmer palette (`.admin`) are token overrides, not component rewrites.

**One design system, two moods.** The CMS looks different from the public site
purely because `AdminShell` applies `.admin`, which retunes semantic tokens.
There is no second component library.

**Errors are values.** Every Server Action returns `Result<T>` — a discriminated
union on `ok`. Errors cross the wire as plain data (`code`, `message`,
`fieldErrors`); no stack trace reaches the browser.

**The database is the authority.** RLS enforces all permissions. `requireRole()`
and the `<Can>` component exist for clear errors and UX, never as the guarantee.

**One Zod schema per entity, used on both sides.** The same schema validates in
the browser (RHF) and in the Server Action, so they cannot disagree.

**Table state lives in the URL** (`?q=&sort=&page=`) — shareable, bookmarkable,
back-button-correct, and readable by Server Components. No client data store.

**Route availability is data.** `navigation_items.is_available` drives it;
`createRouteAvailability(site.nav)` builds a predicate once per render and it is
passed down. Result: **zero dead internal links** while pages are unbuilt. Flip
the flag in the CMS as each page ships — `/programs` is the only one currently
available.

**One configurable primary CTA.** `primary_cta_*` in Site settings, rendered by
`<PrimaryCta>` and reused by navbar, hero, mobile drawer, campaign band and the
programme pages. The org is _not_ always recruiting, so this is a campaign slot,
not a permanent "Become a Volunteer". Its href is `/#how-to-help` — root-relative
so it works from every page, not just the homepage.

**Child safety is enforced in Postgres.** A gallery item cannot be published
unless its media has `consent_verified` — a trigger, not a UI convention. The
public content layer re-checks it before rendering a face, on both the homepage
preview and programme galleries.

**Prose, not Markdown, on programme pages.** No Markdown renderer is installed.
`<Prose>` splits on blank lines and supports `*emphasis*`, which is the whole
vocabulary. This was a deliberate call not to add a parser dependency to a
project that pins deliberately, and it matches the "reads like a story, not a
blog post" brief. **`<Prose>` is the single component to swap** if richer
formatting is ever wanted — see §9.

**The CMS stores the programme story in three columns; the page joins them.**
`body` (overview), `activities` and `objectives[]` are separate because they are
easier to write and revise that way, but the source documentation was written as
one narrative, so `getProgramBySlug()` composes a `narrative` field and the page
renders a single "Event overview". Rejoining `objectives` reproduces the source
paragraph exactly. Kept split deliberately — see the trade-off note in §8.

**Media relationships are columns; `content` jsonb holds copy only.** A page's
images are real foreign keys — `pages.hero_media_id` for the photograph,
`pages.og_media_id` for the social-sharing card — exactly like
`programs.cover_media_id` and `stories.hero_media_id`. This is not stylistic:
PostgREST can only embed (`media:hero_media_id(...)`) through a real
relationship, so an id buried in jsonb cannot be joined, and the public site
would need a second round trip to resolve it. `saveHomePage` therefore lifts
`heroMediaId` out of the payload before the rest is spread into `content`, and
`buildHomePageRow` (a pure function, split out the way `buildMetadata` is split
from `generateSiteMetadata`) is where that mapping lives so it can be verified
without a session. Migration `0011` added the column and backfilled it out of
the jsonb key the editor used to write. See the gotcha in §9 for what went
wrong before.

**A form must not write columns it does not edit.** The homepage editor has no
social-sharing image field, so `saveHomePage` omits `og_media_id` from its row
entirely rather than writing `ogMediaId ?? null` — which used to clear the
column on every save. Absent means "not mine to touch"; only a supplied value
is written.

**The hero photograph is masked into the `pebble` blob — a design choice made
with its cost known.** `soft`/`pebble`/`petal` consume the entire length of
every edge, so their outlines never reach a corner. That is the brand's
paper-cut signature, and on a group photograph it trims the subjects at the
horizontal extremes: here, the outer edges of the two outside drawings and both
outer hems. A tuned variant that kept a straight run down each side (deep
corners, no edge fully consumed) was built and compared side by side; the
full blob was preferred on design grounds. Don't "fix" this by tightening the
shape — but do re-check what the outline removes before masking any _other_
photo with one.

The cream hairline is a `border`, not padding: `overflow-hidden` clips to the
padding box and the browser derives the inner curve itself (outer radius minus
border width), which is the only way to get an even outline around an irregular
shape. An inset mat cannot follow a blob.

**Frame photographs at the ratio they were shot at** (the hero is
`aspect-[4/3]` at every breakpoint) — a height-driven or portrait frame made
`object-cover` discard 17% of the picture on desktop and 40% on mobile.

**A rotating homepage gallery via ISR, not a dynamic route.** The homepage shows
four photographs drawn at random from the whole gallery. On a purely static page
that draw happens once at build and never changes, so the freshness comes from
`export const revalidate = 3600` on `app/page.tsx`, not from the shuffle —
regeneration reshuffles. Making the route dynamic would achieve the same
rotation at the cost of a database round trip for **every** visitor, which is
exactly what the cookie-less public client exists to avoid. Shuffle happens in
`getGalleryImages({ shuffle: true })` on a copy of the cached array, because the
array is shared through `cache()` and reordering it in place would reorder it
for every other caller in that render.

**One gallery component, two configurations.** `GalleryCollection` takes an
optional `previewCount`: a programme page passes 6 and gets a preview grid plus
"view all"; `/gallery/[slug]` passes none and gets every image. Both open the
same `GalleryLightbox`. The difference between the two pages is a prop, never a
second component — and `Lightbox` (single image, homepage thumbnails) stays a
separate, simpler thing on purpose.

**The gallery is organised by event, from one query.** `getGalleryEvents()` is
the only public read of `gallery_items`; the flat list the homepage shuffles,
the single event `/gallery/[slug]` renders, and the images a programme page
shows are all _derived from it in memory_ through `cache()`. So the event index,
an event page, a programme page and the homepage preview cannot disagree about
what is published, in what order, or under which consent rule.

The grouping is not new data — it is `gallery_items.program_id` read back, the
relationship the images were imported with. There is no album table, no
duplicated image rows, and an image belongs to exactly one event. Images whose
programme is draft, archived or absent fall into an ungrouped "More moments"
bucket rather than vanishing or linking to a page that does not exist.

**Two pages per event, on purpose.** `/programs/[slug]` is the story (narrative,
volunteers, a six-image preview); `/gallery/[slug]` is the photographs. Each
links to the other, and neither repeats the other's content — the event is
written down once.

**The decorative language is three supplied assets, transformed — never new
artwork.** `src/assets/decor/` holds the official pieces cut out of the two
design sheets in `design/`: the figure with brush and tool, a leaf spray, and a
spiral. They are rendered through `<Decor>`, which is `alt=""` + `aria-hidden`
by construction. **Variety comes from transforming these three** — scale,
rotation, mirroring (`-scale-x-100`), opacity — which is what keeps every page
related without any two looking alike. Do not add drawn SVG ornament back; the
motifs in `motifs.tsx` survive only as `Blob`, used for the large off-canvas
colour washes, which are tint fields rather than ornament.

Two things about the extraction are worth knowing before re-cutting anything
from `design/`: the spiral shipped with a **transparency checkerboard
rasterised into the artwork** (opaque light-grey and white squares, which is why
clearing only non-opaque pixels left it behind), and the sheets are 3.9 MB of
PNG that becomes ~150 KB of WebP with no visible loss.

**The figure is spent, not sprinkled.** It is the only asset depicting a person,
which makes it the loudest thing available — used as punctuation it reads as
joy, repeated it reads as a logo. It appears **three times on the homepage**:
in _Who Are We_ (the section is about the people), in _How to help_ (a figure
with its arms up is the outcome of giving, not an ornament), and in the footer
(after the content ends, as a sign-off). Adding a fourth should require an
argument.

Everything else lives in the shared `DecorativeBackground` presets rather than
being pasted per page, so the inner pages inherit the language automatically:
`garden` is the richest, `scatter` is deliberately its mirror image so a reader
moving from the homepage to `/programs` meets the same vocabulary in a different
arrangement, and `blobs` is the quietest. Density is a rhythm, not a constant —
the programmes section carries **zero** decoration on purpose, as a rest beat
between the two densest sections. Measured coverage runs 0–8% per section, with
_Who Are We_ the deliberate peak, and 18 of the homepage's 21 pieces are hidden
below `md`. Motifs are kept clear of the text block's bounding box: a motif
inside the column reads as a typo rather than as decoration.

**Layout follows the data, never a fixed assumption.** The impact ledger derives
its grid columns from `entries.length` (it used to hardcode four, which left an
empty column and pushed three metrics off-centre). Card grids use
`Stagger itemClassName="h-full"` so every card in a row matches height.

---

## 7. Reusable abstractions (use these; don't reinvent)

### Backend

| API                                                        | Purpose                                                                                                                    |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `createRepository(table)`                                  | Typed CRUD: `list` (paginated/filtered/**searchable**), `findById`, `findBy`, `findOptional`, `create`, `update`, `remove` |
| `createEntityActions({...})`                               | Generates create/update/remove/reorder Server Actions; auto camelCase→snake_case                                           |
| `createAction({...})`                                      | Generic action factory: authorize → validate → execute → revalidate → `Result`                                             |
| `requireUser/requireEditor/requireAdmin/requireSuperAdmin` | Session + role guards                                                                                                      |
| `uploadMedia` / `deleteMedia` / `getMediaUrl`              | The **only** places that touch storage (`getPublicUrl` / `getSignedUrl` back them)                                         |
| `Result<T>`, `AppError`, `attempt()`                       | Error handling                                                                                                             |

### CMS UI — all from `@/components/admin`

`AdminShell` · `AdminPageHeader` · `DataTable` + `TableToolbar` +
`TablePagination` + `RowActions` + `StatusBadge` · `EditorForm` + `FormSection`

- `FormField` + `ImageFormField` + `CheckboxFormField` + `useAdminForm` ·
  `ConfirmDialog` · `Panel` (modal/drawer) · `useToast` · `Dropzone` ·
  `MediaPicker` · `Can`

### Public content layer — `@/server/content`

| API                                         | Returns                                                              |
| ------------------------------------------- | -------------------------------------------------------------------- |
| `getSiteContent()`                          | Settings, navigation, socials, campaign (incl. its background image) |
| `createRouteAvailability(nav)`              | Predicate for "is this route built yet?"                             |
| `getHomeContent()`                          | Homepage copy + featured programmes, gallery, testimonials, figures  |
| `getPrograms({ featuredOnly?, limit? })`    | Published programmes as cards — used by **both** homepage and index  |
| `getProgramSlugs()`                         | Slugs for `generateStaticParams()`                                   |
| `getProgramBySlug(slug)`                    | One programme + composed `narrative` + its gallery                   |
| `getGalleryEvents()`                        | Published photographs grouped by event — the **only** gallery query  |
| `getGalleryEvent(slug)` / `…EventSlugs()`   | One event / slugs to prerender, both derived from the above          |
| `getGalleryImages({ shuffle?, limit? })`    | The same photographs flattened — the homepage rotating four          |
| `toImageAsset(client, media, fallbackAlt?)` | The one media-row → `ImageAsset` mapper (`content/media.ts`)         |

All are `cache()`d per request and read through the **cookie-less**
`lib/supabase/public.ts` client, which is what keeps public routes static.
Never call `supabase.from()` from a page or component.

### Public design system

`Container` `Section` `Stack` `Cluster` `Grid` `AutoGrid` `Split` `Sidebar`
`Flow` · `Heading` `Text` `Emphasis` `Prose` · `Button` `Card` `Input` `Field` … ·
`Reveal` `Stagger` `Floating` `AnimatedCounter` · brand motifs + `OrganicFrame` ·
`ProjectCard` `ProjectGrid` `FeaturedProjects` · `GalleryGrid` `GalleryItem`
`Lightbox` `GalleryLightbox` `GalleryCollection`

`Lightbox` is the single-image modal (homepage preview); `GalleryLightbox` is
the collection browser (arrow keys, swipe, prev/next, live counter, neighbour
preloading) and `ProgramGallery` owns its open state. They are siblings on
purpose — a gallery needs shared state and paging that the single-image version
should not carry.

**Adding a new CMS editor** (the whole recipe, see `docs/CMS.md`):

1. `"use server"` file delegating to `createEntityActions`
2. Server list page reading `searchParams` → `repository.list(...)`
3. One form component for new + edit, wrapped in `EditorForm`

---

## 8. Outstanding tasks

### ✅ Done — provisioning, CMS integration, programmes, real content, gallery

Supabase project `Chayar-asroy` (`ap-northeast-2`, Postgres 17) is live and
linked, migrations `0001`–`0011` applied, every CMS editor exercised in the
browser, the public site reading from the CMS, the programmes archive built, the
four real programmes plus real impact figures imported, and **19 event
photographs** imported into the media library and published to `/gallery` —
consent confirmed by the organisation, each attached to its programme via
`gallery_items.program_id`, each with hand-written alt text.

Setting up a **second environment** (staging) follows this recipe:

1. Create a Supabase project; set `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
2. `pnpm dlx supabase init` (no `config.toml` is committed) → `login` → `link` →
   `db push` (applies `0001`–`0011`). Run `seed.sql` **in the SQL editor** — see
   the seed gotcha in §9. Then regenerate types **into a new file**:
   `pnpm dlx supabase gen types typescript --linked > src/types/database.generated.ts`
   — **never** over `src/types/database.ts` (§9).
3. Create the first user in the dashboard, then promote:
   `update public.profiles set role='super_admin' where email='…';`
4. Run both validation harnesses (§4).

### 🔴 Next priorities, in order

1. **Close the `fast-uri` advisory** (§2) — an `overrides` entry in both
   `pnpm-workspace.yaml` and `package.json`, then `pnpm install` and re-run the
   gate. Small, self-contained, and it belongs in its own commit.
2. **Set programme cover images.** The gallery is populated, but `programs`
   still have no `cover_media_id`, so every programme card on `/programs` and
   the homepage renders a placeholder while real photographs of that programme
   sit in the library. Pick one per programme in the Programs editor — the
   cheapest remaining visual win.
3. **Give the campaign band a background** (`site_settings.campaign_media_id`)
   — the last placeholder image on the homepage.
4. **Retire the remaining placeholder content** (see blockers below).
5. **Transfer ownership** — repo, Supabase org, domain and Vercel project are on
   a personal account.
6. Then: the remaining inner pages, or Supabase-backed forms.

### Content blockers — required before public launch

- **Guardian consent** for any identifiable child's photo or name. The 19
  imported photographs were confirmed by the organisation on 4 August 2026 and
  are marked `consent_verified`; anything added later needs the same check.
- **Homepage copy is still placeholder** — hero, mission, voices, how-to-help
  and the campaign band all came from the retired `src/content/home.ts` and are
  flagged `TODO(org)` in `supabase/seed.sql`. Edit in the CMS, not in code.
- **Testimonials are invented** (Nusrat/Rafi, first-name + age placeholders),
  as is the volunteer quote in the Impact section.
- **Three placeholder programmes** (`creative-workshops`, `learning-support`,
  `community-art-events`) are set to **draft**, not deleted — they are invisible
  publicly but still in the CMS. Delete them once you are sure nothing is needed.
- `supabase/seed.sql` still bootstraps those placeholder programmes for a fresh
  environment. Worth cleaning before provisioning staging.

**Resolved:** impact figures are now real (80 / 20 / 4) and programme content is
the organisation's own, imported verbatim from the Event Documentation PDF.

### Programme content provenance

The four programmes were extracted from the official _Event Documentation_ PDF
and imported **verbatim** — no rewriting, reordering or summarising. Verification
was mechanical rather than by eye: every stored field was checked back against
the extracted source text (78 fields/paragraphs, all matching), and each
programme's `objectives`, rejoined, is byte-identical to its source paragraph.

Two deliberate transformations, both reversible:

- **Objectives were split into sentences**, because the PDF states them as prose
  and the CMS field is an ordered list. Rejoining restores the original exactly.
- **"Special collaboration with BUTAM"** (Art Workshop 3) has no matching CMS
  field — no partners/collaborations concept exists. It is preserved verbatim as
  the closing line of that programme's Activities. It is the only item whose
  _placement_ differs from the source.

`summary` is the verbatim **first sentence** of each opening paragraph, because
the column is `not null` and the PDF has no summary field.

### Later

- Remaining inner pages (Our Journey, Gallery, Stories, Get Involved, Contact).
  All are `is_available: false` in `navigation_items`; flip each flag in the CMS
  as its page ships and the navigation and section CTAs re-link themselves.
- Supabase-backed forms (volunteer applications, donation pledges, contact)
- Decide EN-only vs bilingual EN/BN (Bengali font stack already wired)
- Consider migrating `src/middleware.ts` to Next 16's `proxy` convention (§9)

### Remaining technical debt

- **No Markdown rendering.** `<Prose>` handles paragraphs + `*emphasis*` only.
  The Stories editor still advertises full Markdown in its help text, and there
  is no public Stories page yet, so nothing is visibly broken — but the two are
  inconsistent.
- **Hardcoded copy on `/programs`.** The page hero ("Programs" + its lead
  paragraph) is in the page file, unlike the homepage which reads from
  `pages.content`. It should move to a `pages` row with slug `programs`.
- **Hardcoded SEO `keywords`** in `lib/seo/metadata.ts`, with no CMS home.
- **Impact ledger orphan row.** At 5+ metrics the final partial row is
  left-aligned, not centred — a CSS Grid constraint. Exact for 1–4.
- **Gallery ordering is numeric** (no drag-and-drop), and images are attached to
  a programme from the Gallery editor rather than inline on the programme.
- **Mission pillars are fixed at two**; donation categories and impact-icon
  names are code-level registries, not editable rows.
- **Dashboard tiles still say "Available in the next phase"** although all six
  editors exist. `Welcome back, there` is an awkward null-name fallback.
- **No staging environment**; `revalidatePath` is the only cache invalidation.

### Remaining UI polish

- **Nothing has been visually confirmed in a real browser.** The in-app preview
  does not composite (§9), so every layout claim in this document was verified
  by measuring the DOM — geometry, contrast, heading order — not by looking at
  pixels. A pass on a real monitor and a real phone is worth doing.
- Programme detail body measure is **896px ≈ 117 characters per line**, above
  the 45–75 ideal. It was widened deliberately on request; the lever that would
  buy readability back is a larger body size, not a narrower column.
- The campaign band's dark wash is **70–85%**, deeper than the 50–70% originally
  specified, because at 60% even pure white small text measured 4.44:1 against a
  bright photograph — below the AA floor. Revisit only with contrast in hand.
- Logo on the new cobalt footer has not been checked against the blue.

---

## 9. Known limitations & gotchas

**`supabase db push --include-seed` will not re-run a seed it has already
applied.** It prints "Updating seed hash" and records the new hash _without
executing the file_, so edits to `seed.sql` never reach an existing remote
project. Run changed seed SQL through the dashboard SQL editor instead. (The
file stays idempotent, so re-running it is always safe.)

**A CMS field that saves without error can still be read from the wrong place.**
The homepage "Hero image" picker wrote its id into `pages.content.heroMediaId`
(jsonb) while the public site read `pages.og_media_id`. Every layer worked in
isolation — the picker saved, the editor's thumbnail rendered (it read the same
jsonb key), no error appeared anywhere — and the hero silently showed its
placeholder no matter what an editor chose. Two lessons: a media id belongs in a
column, not jsonb (§6); and when a CMS field appears to do nothing, **compare
the column the form writes with the column the page reads** before suspecting
the component. Fixed by migration `0011`.

**`alt_text` is `not null`, which does not mean it has a value.** An empty
string satisfies the constraint, and uploads deliberately set `""` because files
arrive in batches through the dropzone. Alt text is therefore required by the
media **details** form (`updateMediaSchema`), and `toImageAsset` takes an
optional `fallbackAlt` for rows stored before that rule existed — the homepage
passes its headline. Check `alt`, not just presence, when auditing images.

**Public reads must use `lib/supabase/public.ts`, not `server.ts`.** The latter
reads `cookies()`, which opts the route out of static rendering; using it on the
homepage would silently turn `/` from `○` into `ƒ` and cost a database round
trip on every visit. Check the build's route table after touching public data.

**Radix `Menu.Item asChild` around a `<form>` silently breaks submission.**
Sign-out was dead for exactly this reason: with `asChild` the `<form>` _became_
the menu item, and selecting it closed and unmounted the menu in the same event,
before the browser could submit. Nothing errored — the click just did nothing.
Wrap the item in the form instead (`className="contents"`) and submit explicitly
from `onSelect` after `preventDefault()`. Suspect this pattern whenever a menu
action appears to do nothing.

**Next's dev server logs Server Action arguments — including passwords.** A
successful sign-in printed the user's plaintext password to the terminal. Closed
by ignoring `/admin/login` in `logging.incomingRequests` (`next.config.ts`).
Never add a credential-bearing argument to a Server Action on a route whose
request logging is still enabled.

**Copying server props into `useState` freezes the list.** `GalleryManager` did
`useState(initialItems)` and then called `router.refresh()`; the refreshed props
were ignored because `useState` only reads its initial value once, so newly
added images never appeared until a full page load. Derive from props and let
`router.refresh()` be the single update path — the same trap as the
`set-state-in-effect` rule below, one layer up.

**Prefer CSS to a JS animation driver for anything that hides content.** A
"show more" region animated with Motion's `height: auto` left the content
**permanently unreachable** when the driver never ran: `aria-expanded` flipped to
`true` and `inert` was removed, but the inline style stayed `height: 0px`. The
open state must be expressible in CSS (`grid-rows-[0fr]` → `[1fr]`) so the worst
failure is "appears instantly", never "never appears".

**Animations are unverified at runtime.** The in-app browser pane in this
environment stops compositing — screenshots fail, CSS transitions never advance,
`window.innerWidth` sometimes reads 0, and **all** Motion `whileInView`
animations stall at opacity 0 page-wide (verified: 39/39 elements, including
untouched sections). If you see this, sample `main [style*="opacity"]`; if
everything is 0, it's the environment, not the code.

To prove a layout is correct despite the stall, **disable the transition inline
and re-measure** (`el.style.transition = 'none'; void el.offsetHeight;`). If the
element then reports its natural size, the layout is sound and only the frame
loop is dead. Verify motion in a real browser.

**Measure contrast by compositing, not by parsing the colour string.** Tailwind
opacity utilities compute to `oklab(… / 0.8)`; naively pulling numbers out of
that string yields nonsense ratios. Resolve the colour through a 1×1 canvas,
alpha-composite it over the real background, then compute the ratio. Doing this
properly is what caught the campaign band failing AA against a bright image.

**In a `values` subquery, an enum literal infers as `text`.** `insert … select
… from (values …)` into a `content_status` column fails without an explicit
`::public.content_status` cast. The direct `insert … values` form does not.

**`"use server"` modules may only export async functions.** A stray
`export const` silently voids _all_ exports; the build fails with
"export X doesn't exist". `pnpm typecheck` does **not** catch this — only
`pnpm build` does.

**tailwind-merge and custom font sizes.** `cn()` was silently dropping
`text-display`/`text-h5` etc. (it read them as colours conflicting with
`text-primary`), rendering at base 16px with no error. Fixed in
`src/lib/utils/cn.ts` via `extendTailwindMerge`. **Keep that font-size list in
sync with the `--text-*` tokens in `globals.css`.**

**pnpm overrides live in `pnpm-workspace.yaml`**, not `package.json` — pnpm v11
ignores the `pnpm` field. Losing this silently reintroduced 5 CVEs once.
`brace-expansion` must stay pinned **per major** (`@1`, `@2`); forcing the
advisory's v5 globally breaks ESLint via minimatch v3. `package.json` keeps a
**mirrored npm `overrides` block** so the project stays safe under either
package manager — the two lists must be edited together. `pnpm-workspace.yaml`
also carries `allowBuilds` (sharp, unrs-resolver) and `minimumReleaseAgeExclude`
entries; removing those breaks install, not security.

**`src/types/database.ts` must never be overwritten by the type generator.** It
is hand-authored and exports ~16 named types (`UserRole`, `Profile`, `Program`,
`Row<T>`, `TableName`, `InsertPayload`…) imported by **31 files**.
`supabase gen types` emits only `Database` plus generic helpers, so the obvious
`… > src/types/database.ts` breaks the entire backend and CMS at typecheck.
Generate to `database.generated.ts` and re-export the aliases from it, keeping
this module's public API identical. (`docs/BACKEND.md` §1.)

**Server Action payloads are cast before they reach supabase-js**, so
`typecheck` cannot verify that a written column actually exists. This shipped a
real bug: `createEntityActions` stamped `updated_by` on `gallery_items`, which
had no such column, and **every Gallery save failed** with PostgREST `PGRST204`.
Fixed by migration `0006` plus a type-level `AUDITED_TABLES` guard in
`entity-actions.ts` that fails compilation in both directions. When adding a
column-writing behaviour to the shared factory, verify it against the schema —
the compiler will not.

**The production build needs network access to Google Fonts.** `next/font`
fetches Inter at build time; offline or with the request blocked, `pnpm build`
fails with "Failed to fetch `Inter` from Google Fonts". Retrying once the
network is available succeeds — it is not a code regression.

**Next 16 deprecates the `middleware` convention.** Every build prints
`The "middleware" file convention is deprecated. Please use "proxy" instead.`
`src/middleware.ts` still runs and the build succeeds — the route table lists it
as `ƒ Proxy (Middleware)`. Migrating is a deliberate later decision; it is not a
broken state.

**React lint rule `set-state-in-effect`** bans syncing props→state in an effect.
Fix by remounting with `key={item?.id}` and initialising state from props, or by
adjusting state during render with a "last value" tracker.

**No-JS / failed-observer risk (undecided).** `initial="hidden"` renders
`opacity: 0` into the server HTML, so if JS fails to load, motion-wrapped
content stays invisible — site-wide, pre-existing. A no-JS fallback has **not**
been implemented; worth a decision before launch.

**An SVG logo would be better** than the 449 KB PNG. `<Logo>` already
auto-detects format, so it's a one-line change to `siteConfig.logo.src`.

**Stray dev servers.** `preview_stop` can leave a Next process on port 3000;
kill it before restarting.

---

## 10. Working agreements

- Run `pnpm lint`, `pnpm typecheck`, `pnpm build` after every subsystem; fix
  everything before moving on.
- Reuse existing abstractions; improve them rather than duplicating. Never add
  editor-specific UI where a shared component fits.
- Server Components by default; `"use client"` only at interactive leaves.
- Semantic tokens only — never raw hex.
- Conventional Commits (enforced by commitlint); lint-staged runs on pre-commit.
- Be explicit about what was verified vs. assumed. Do not invent organisational
  facts or numbers.
