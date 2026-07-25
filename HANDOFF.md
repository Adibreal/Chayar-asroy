# Chayar Asroy — Project Handoff

Everything a new contributor (or a new conversation) needs to continue this
project. Reflects the state as of **26 July 2026**.

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
| Public homepage              | ✅ Built, refined, validated                                                  |
| Design system                | ✅ Complete + documented                                                      |
| Backend platform (Supabase)  | ✅ Code complete — **never run against a live DB**                            |
| CMS framework + 6 editors    | ✅ Built — **never run against a live DB**                                    |
| Inner public pages           | ❌ Not built (Our Journey, Programs, Gallery, Stories, Get Involved, Contact) |
| Public site reading from CMS | ❌ Not done — this is **Phase 5D**                                            |

**Repo:** `C:\Users\Acer\Documents\Project\Chayar asroy`
**Git:** initialised, branch `master`, **zero commits so far** (~24 untracked
entries). Nothing has been committed or pushed yet.

**Validation — all green:**

```bash
pnpm lint        # ✅
pnpm typecheck   # ✅
pnpm build       # ✅
pnpm audit --prod # ✅ no known vulnerabilities
```

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
├── app/
│   ├── page.tsx              public homepage
│   ├── (admin)/admin/        protected CMS (force-dynamic)
│   ├── (auth)/admin/login/   login — SEPARATE group on purpose (see §6)
│   └── (dev)/showcase/       design-system showcase, dev only
├── components/
│   ├── ui/ layout/ typography/ brand/ motion/   design system (Phase 3A)
│   ├── navigation/ hero/ projects/ gallery/ testimonials/
│   │   impact/ volunteer/ contact/ cta/ sections/ media/   sections (3B)
│   └── admin/                CMS framework: layout, data, forms,
│                             feedback, dashboard, media, permissions
├── config/     env.ts (validated), site.ts, admin-nav.ts
├── content/    home.ts — homepage content as data
├── lib/        utils(cn), styles, motion, seo, supabase clients, permissions
├── server/     auth, db, repositories, actions, storage, shared, media-url
├── types/      database.ts (hand-authored), content.ts
└── validation/ common, auth, media, content  (Zod — single source of truth)

supabase/migrations/  0001 foundation · 0002 content · 0003 RLS
                      0004 storage    · 0005 gallery fields
supabase/seed.sql     idempotent starter data
```

**Docs:** `README.md`, `DESIGN_SYSTEM.md`, `docs/ARCHITECTURE.md`,
`docs/BACKEND.md`, `docs/DATABASE.md`, `docs/CMS.md`.

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
| `uploadMedia` / `deleteMedia` / `getMediaUrl`              | The **only** places that touch storage                                                                                     |
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

### Blocking — needed before anything can be verified

1. **Create a Supabase project.** Nothing has ever run against a live database.
   Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
2. **Run migrations `0001`–`0005` + `seed.sql`**, then regenerate types:
   `pnpm dlx supabase gen types typescript --project-id <ref> > src/types/database.ts`
3. **Create the first user**, then promote:
   `update public.profiles set role='super_admin' where email='…';`
4. **Smoke-test one full cycle**: log in → upload an image → create a program →
   publish it. The upload → storage → row-insert path is the most likely place
   for a first-contact surprise.

### Content blockers — required before public launch

5. **Real impact figures.** The current 500/40/25/12 are **placeholders the
   assistant invented**, flagged `TODO(org)` in `src/content/home.ts`.
   Publishing invented impact numbers would mislead donors.
6. **Guardian consent** for any identifiable child's photo or name. Testimonials
   currently use first-name + age placeholders.
7. **Real copy** for mission/vision, programs, stories; **real photography**.
8. Confirm the volunteer quote in the Impact section is something a volunteer
   actually said.

### Next phase (5D) — migrate the public site to the CMS

The homepage still reads `src/content/home.ts` and `src/config/site.ts`. Swap
these for repository calls. The schema and components were designed for this:
sections already take data via props.

### Later

- Inner pages (Our Journey, Programs, Gallery, Stories, Get Involved, Contact)
- Supabase-backed forms (volunteer applications, donation pledges, contact)
- Deploy to Vercel; **org-owned** domain + accounts, not a graduating student's
- Decide EN-only vs bilingual EN/BN (Bengali font stack already wired)

---

## 9. Known limitations & gotchas

**Nothing has been verified against a live database.** All backend and CMS code
is type-safe and builds, but has never executed a query, upload or save.

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
advisory's v5 globally breaks ESLint via minimatch v3.

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
