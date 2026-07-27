# Chayar Asroy

The official website of **Chayar Asroy (ছায়ার আশ্রয়)** — a student-led initiative
supporting underprivileged children in Bangladesh through creativity, learning,
and community.

## Tech stack

| Concern    | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 16 (App Router, React 19, RSC)        |
| Language   | TypeScript 5 (strict)                         |
| Styling    | Tailwind CSS v4 (CSS-first design tokens)     |
| Backend    | Supabase — code complete, not yet provisioned |
| Forms      | React Hook Form + Zod                         |
| Animation  | Motion (`motion/react`)                       |
| Validation | Zod + `@t3-oss/env-nextjs`                    |
| Tooling    | ESLint 9 · Prettier · Husky · lint-staged     |
| Packages   | **pnpm only** (the npm lockfile was removed)  |
| Hosting    | Vercel (planned)                              |

## Getting started

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env.local   # then fill in values as phases require

# 3. Run the dev server
pnpm dev                     # http://localhost:3000
```

> Requires Node `>= 20.9` (see `.nvmrc` — the project is developed on Node 24).
> **Use pnpm, not npm.** Dependency overrides that patch known CVEs live in
> `pnpm-workspace.yaml`; installing with npm silently skips them.

## Scripts

| Script              | Purpose                        |
| ------------------- | ------------------------------ |
| `pnpm dev`          | Start the dev server           |
| `pnpm build`        | Production build               |
| `pnpm start`        | Serve the production build     |
| `pnpm lint`         | Lint with ESLint               |
| `pnpm lint:fix`     | Lint and auto-fix              |
| `pnpm typecheck`    | Type-check with `tsc --noEmit` |
| `pnpm format`       | Format with Prettier           |
| `pnpm format:check` | Verify formatting              |

## Project structure

```
src/
├── middleware.ts   # session refresh + coarse /admin auth gate
├── app/            # App Router: routes, layout, globals.css, robots, sitemap
│                   #   plus (admin) CMS, (auth) login, (dev) showcase
├── components/     # ui · brand · layout · typography · motion · sections
│                   #   plus admin/ — the CMS framework
├── config/         # env (validated) · site config · admin nav
├── content/        # content-as-code (homepage)
├── hooks/          # reusable client hooks
├── lib/            # utils · styles · seo · motion · supabase clients
├── providers/      # app-wide React providers
├── server/         # auth · db · repositories · actions · storage (server-only)
├── types/          # domain + database types
└── validation/     # Zod schemas — the single source of input truth
```

## Conventions

- **Server Components by default**; `"use client"` only where interactivity
  requires it.
- **Design tokens over hardcoded values** — consume semantic tokens
  (`bg-background`, `text-primary`) defined in `src/app/globals.css`.
- **Conventional Commits**, enforced by commitlint on `commit-msg`.
- `lint-staged` runs ESLint + Prettier on staged files at `pre-commit`.
- Never read `process.env` directly — import the validated `env` from
  `src/config/env.ts`.

## Documentation

| Document                                       | Covers                                             |
| ---------------------------------------------- | -------------------------------------------------- |
| [`HANDOFF.md`](HANDOFF.md)                     | **Start here** — full project state and handoff    |
| [`BOOTSTRAP.md`](BOOTSTRAP.md)                 | Primer for starting a fresh assistant conversation |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Frontend/tooling decisions and their rationale     |
| [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)         | Tokens, components, motion, accessibility          |
| [`docs/BACKEND.md`](docs/BACKEND.md)           | Supabase setup, auth, roles, storage, patterns     |
| [`docs/DATABASE.md`](docs/DATABASE.md)         | Schema, relationships, migrations                  |
| [`docs/CMS.md`](docs/CMS.md)                   | Admin routing, layout, tables, forms, permissions  |

> The backend is optional at runtime: without Supabase credentials the site
> still builds and renders. See `docs/BACKEND.md` to provision it.
