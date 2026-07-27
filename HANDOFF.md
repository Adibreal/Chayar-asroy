# Chayar Asroy — Project Handoff

Everything a new contributor (or a new conversation) needs to continue this
project. Reflects the state as of **26 July 2026**, re-audited against the
working tree on that date — every claim below was checked, not assumed.

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

|                              | Status                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------- |
| Public homepage              | ✅ Built, refined, validated (8 sections, CMS-driven)                         |
| Design system                | ✅ Complete + documented                                                      |
| SEO surface                  | ✅ `buildMetadata()`, `robots.ts`, `sitemap.ts`, `icon.svg`                   |
| Version control              | ✅ Committed and pushed to GitHub (`main`)                                    |
| Backend platform (Supabase)  | ✅ Provisioned and **validated against the live project**                     |
| CMS framework + 6 editors    | ✅ Built and **validated end-to-end in the browser** (Phase 5D.0)             |
| Inner public pages           | ❌ Not built (Our Journey, Programs, Gallery, Stories, Get Involved, Contact) |
| Public site reading from CMS | ✅ **Phase 5D** — homepage and shell read live CMS data                       |

**Repo:** `C:\Users\Acer\Documents\Project\Chayar asroy`
**Git:** branch `main`, working tree **clean**, 244 tracked files.
One commit: `3e85df2` — _feat: complete homepage, CMS architecture, and
refinements_ (26 Jul 2026). Pushed to and in sync with `origin` →
`https://github.com/Adibreal/Chayar-asroy.git`.

> The remote is a **personal** GitHub account. Moving it to an org-owned
> account is a launch task (see §8).

**Validation — all green (re-verified 26 July 2026):**

```bash
pnpm lint         # ✅
pnpm typecheck    # ✅
pnpm build        # ✅ 18 routes — 6 static, 12 dynamic (all /admin + login)
pnpm audit --prod # ✅ no known vulnerabilities
```

The build emits one warning: Next 16 deprecates the `middleware` file
convention in favour of `proxy`. See §9.

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
├── lib/        utils(cn), styles, polymorphic, motion/, seo/,
│               supabase/ (client, server, public, middleware, admin, config),
│               permissions
├── server/     auth, db, repositories, actions, storage, shared, media-url
│   └── content/  site.ts, home.ts — the PUBLIC read layer (Phase 5D)
├── types/      database.ts (derived), database.generated.ts, content.ts
└── validation/ common, auth, media, content  (Zod — single source of truth)

supabase/migrations/  0001 foundation · 0002 content · 0003 RLS
                      0004 storage    · 0005 gallery fields
                      0006 gallery_items.updated_by (audit)
                      0007 human-readable consent refusal message
                      0008 impact_stats.icon
supabase/seed.sql     idempotent starter data + homepage placeholder content

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

**Admin routes built:** `/admin` (dashboard) · `/admin/pages` (homepage) ·
`/admin/programs` (+ `new`, `[id]`) · `/admin/stories` (+ `new`, `[id]`) ·
`/admin/gallery` · `/admin/media` · `/admin/settings`. Gallery and Media are
single-screen managers (panel-based), which is why they have no `new`/`[id]`
child routes.

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

**Route availability is config.** `siteConfig.nav` items carry
`available: false`; `NavLinks` filters them and `isRouteAvailable()` gates
section CTAs. Result: **zero dead internal links** while pages are unbuilt. Flip
the flags as pages ship.

**One configurable primary CTA.** `siteConfig.primaryCta` (`label`, `href`,
`enabled`) is rendered by `<PrimaryCta>` and reused by navbar, hero, mobile
drawer and campaign band. The org is _not_ always recruiting, so this is a
campaign slot, not a permanent "Become a Volunteer".

**Child safety is enforced in Postgres.** A gallery item cannot be published
unless its media has `consent_verified` — a trigger, not a UI convention.

**Markdown, not a WYSIWYG**, for story bodies: no heavy dependency, portable
content, no markup the public site can't style.

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

### Public design system

`Container` `Section` `Stack` `Cluster` `Grid` `AutoGrid` `Split` `Sidebar`
`Flow` · `Heading` `Text` · `Button` `Card` `Input` `Field` … ·
`Reveal` `Stagger` `Floating` `AnimatedCounter` · brand motifs + `OrganicFrame`

**Adding a new CMS editor** (the whole recipe, see `docs/CMS.md`):

1. `"use server"` file delegating to `createEntityActions`
2. Server list page reading `searchParams` → `repository.list(...)`
3. One form component for new + edit, wrapped in `EditorForm`

---

## 8. Outstanding tasks

### ✅ Done in Phase 5D.0 — provisioning and validation

Supabase project `Chayar-asroy` (`ap-northeast-2`, Postgres 17) is live and
linked. Migrations `0001`–`0007` applied, seed run, types regenerated, first
`super_admin` created, and every CMS editor exercised in the browser against it.
Steps 1–4 below are complete and kept only as the recipe for a second
environment (staging).

1. **Create a Supabase project.** Set `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
2. **Run migrations `0001`–`0006` + `seed.sql`.** `supabase link` needs a
   `config.toml`, which is not committed — run `pnpm dlx supabase init` first,
   then `login`, `link`, `db push`. Then regenerate types **into a new file**:
   `pnpm dlx supabase gen types typescript --project-id <ref> > src/types/database.generated.ts`
   — **never** over `src/types/database.ts` (see §9).
3. **Create the first user**, then promote:
   `update public.profiles set role='super_admin' where email='…';`
4. **Smoke-test one full cycle**: log in → upload an image → create a program →
   publish it. The upload → storage → row-insert path is the most likely place
   for a first-contact surprise.

### Content blockers — required before public launch

5. **Real impact figures.** The current 500/40/25/12 are **placeholders the
   assistant invented**, now living in the `impact_stats` table and flagged
   `TODO(org)` in `supabase/seed.sql`. Edit them in the CMS, not in code.
   Publishing invented impact numbers would mislead donors.
6. **Guardian consent** for any identifiable child's photo or name. Testimonials
   currently use first-name + age placeholders.
7. **Real copy** for mission/vision, programs, stories; **real photography**.
8. Confirm the volunteer quote in the Impact section is something a volunteer
   actually said.

### ✅ Phase 5D — public site reads from the CMS

`src/content/` is gone and `src/config/site.ts` now holds infrastructure only
(canonical URL, locale, logo asset, and a last-resort brand identity used when
Supabase is unconfigured). Everything the public site shows comes from
`@/server/content`:

- **`getSiteContent()`** — settings, navigation and socials, request-cached and
  shared by the header, footer and metadata.
- **`getHomeContent()`** — homepage copy (`pages.content` jsonb) plus featured
  programs, gallery preview, testimonials and impact figures.

Reads go through `lib/supabase/public.ts`, a **cookie-less** anon client, so `/`
stays statically rendered (verified: still `○` in the build output) and is
refreshed by the `revalidatePath()` calls the CMS actions already make.

### Later

- Inner pages (Our Journey, Programs, Gallery, Stories, Get Involved, Contact).
  All six are still `available: false` in `siteConfig.nav`; flip each flag as
  its page ships and the navigation and section CTAs re-link themselves.
- Supabase-backed forms (volunteer applications, donation pledges, contact)
- **Transfer ownership.** The repo now lives at
  `github.com/Adibreal/Chayar-asroy` — a personal account. Repo, Vercel
  project, domain and Supabase org should all be **org-owned**, not a
  graduating student's.
- Decide EN-only vs bilingual EN/BN (Bengali font stack already wired)
- Consider migrating `src/middleware.ts` to Next 16's `proxy` convention (§9)

---

## 9. Known limitations & gotchas

**`supabase db push --include-seed` will not re-run a seed it has already
applied.** It prints "Updating seed hash" and records the new hash _without
executing the file_, so edits to `seed.sql` never reach an existing remote
project. Run changed seed SQL through the dashboard SQL editor instead. (The
file stays idempotent, so re-running it is always safe.)

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

**Animations are unverified at runtime.** The in-app browser pane in this
environment stops compositing — screenshots fail and **all** Motion
`whileInView` animations stall at opacity 0 page-wide (verified: 39/39 elements,
including untouched sections). If you see this, sample
`main [style*="opacity"]`; if everything is 0, it's the environment, not the
code. Verify motion in a real browser.

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
