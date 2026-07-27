# Architecture decisions

A concise record of the choices made building the Phase 2 foundation, so future
contributors understand the _why_, not just the _what_.

## Framework & language

- **Next.js 16 (App Router, RSC) + React 19.** Server-first rendering for SEO,
  performance, and minimal client JS — the right default for a content- and
  photo-heavy nonprofit site.
- **TypeScript in strict mode**, plus `noUncheckedIndexedAccess` and
  `noImplicitOverride` for extra long-term safety.

### Deliberate version pins (stability over bleeding edge)

At build time the registry offered **TypeScript 7** (the new native compiler)
and **ESLint 10**. Both are pinned _down_:

- **TypeScript `^5.9`** — `eslint-config-next@16` ships `typescript-eslint@8`,
  which officially supports TS 5.x, not TS 7. Using TS 7 would trigger
  unsupported-version warnings and risk parser breakage in lint/typecheck.
- **ESLint `^9`** — `typescript-eslint@8` targets ESLint 8/9. ESLint 10 would
  create peer-dependency conflicts.

These are the newest versions the Next.js lint/type toolchain fully supports.
Revisit when `eslint-config-next` bumps `typescript-eslint` to a TS 7 / ESLint
10 compatible major.

### Patched transitive dependencies (dependency `overrides`)

`next` pins `sharp` (`^0.34.5`) and `postcss` (`8.4.31`) to ranges with known
advisories (GHSA-f88m-g3jw-g9cj, GHSA-qx2v-qp2m-jg93). The audit's only proposed
fix was to _downgrade Next to v9_ — unacceptable. Instead, overrides force the
API-compatible patched versions (`sharp@^0.35.3`, `postcss@^8.5.23`), bringing
`pnpm audit --prod` to **0 vulnerabilities** without touching Next. Remove them
once Next ships updated ranges.

The project later moved to **pnpm only**, and pnpm v11 does not read overrides
from `package.json`. They therefore live in **`pnpm-workspace.yaml`**, with a
mirrored npm `overrides` block kept in `package.json` so the project stays safe
under either package manager — **edit both or neither**. `brace-expansion` is
pinned _per major_ (`@1`, `@2`): the advisory names v5, but forcing v5 globally
breaks minimatch v3, which ESLint depends on (verified, not assumed).

## Styling & design tokens

- **Tailwind CSS v4** with the CSS-first `@theme` API. Chosen over v3's
  JS config because the token model _is_ the design system: primitives →
  semantic aliases → theme mapping, all in `globals.css`.
- **Semantic-token indirection** (`--primary` → `--cobalt-500`) means a future
  theme (e.g. dark mode) only overrides the semantic layer — components never
  change. `@theme inline` keeps utilities pointed at the live CSS variables.
- **Brand palette** (cobalt, marigold, forest, orange, cream) is taken from the
  official logo **and campaign posters** — confirmed in Phase 1, including that
  cobalt blue is a genuine brand color. Exact hex values will be re-sampled once
  the vector logo is provided.

## Environment safety

- **`@t3-oss/env-nextjs` + Zod** validate env vars and enforce the
  server/client boundary at build time. This prevents a real class of bug —
  leaking a server secret into the client bundle — which hand-rolled
  `process.env` access does not. Import `env` from `src/config/env.ts`, never
  `process.env`.
- Supabase vars are **optional** so the app builds with no secrets; consumers
  throw a clear error if used unconfigured. Real values arrive in Phase 3.

## Motion

- **Motion (`motion/react`)** with a global `MotionConfig reducedMotion="user"`
  so accessibility is the default, not an afterthought.
- Timing lives in `src/lib/motion/tokens.ts` and mirrors the `--duration-*` /
  `--ease-*` CSS tokens, so JS and CSS motion stay in sync.

## Accessibility (built into the foundation)

- Skip-to-content link, semantic `<main>`, `lang` attributes.
- Visible `:focus-visible` rings using the brand ring token.
- A global `prefers-reduced-motion` safety net in CSS _and_ via MotionConfig.
- Contrast discipline baked into token roles: marigold/orange are fills only;
  cobalt and ink carry text. Targeting **WCAG 2.2 AA**.

## Security baseline

- Baseline security headers in `next.config.ts` (`nosniff`, `frame-options`,
  `referrer-policy`, HSTS, `permissions-policy`). A nonce-based CSP is deferred
  until real origins exist, to be tested against real pages.
- `poweredByHeader: false`. Service-role key is server-only and never exposed.

## Content strategy

- **Content-as-code first** (typed data / MDX), Supabase for _submissions_ only.
  A CMS/admin was to be added later only if non-technical editors needed it —
  avoiding an unmaintained custom admin.
- **That condition was met, and the migration is done.** The site is maintained
  by rotating student volunteers, so a CMS was built in Phase 5B/5C
  (`docs/CMS.md`) and the public site moved onto it in Phase 5D. `src/content/`
  is retired; `src/config/site.ts` keeps only infrastructure. Because sections
  already took their data via props, the swap was a data-source change rather
  than a rewrite — exactly what this design anticipated.
- Public reads live in `src/server/content/` and use a **cookie-less** Supabase
  client, so pages stay statically rendered and are refreshed by the
  `revalidatePath()` calls the CMS actions already make.

## Deferred to later phases (status)

Written during Phase 2. Since delivered: reusable UI components · homepage ·
database schema & RLS · CMS/admin · auth & middleware.

**Still deferred:** inner pages · analytics · full nonce-based CSP · real
content and consent-cleared photography.
