# Chayar Asroy

The official website of **Chayar Asroy (ছায়ার আশ্রয়)** — a student-led initiative
supporting underprivileged children in Bangladesh through creativity, learning,
and community.

## Tech stack

| Concern    | Choice                                    |
| ---------- | ----------------------------------------- |
| Framework  | Next.js 16 (App Router, React 19, RSC)    |
| Language   | TypeScript 5 (strict)                     |
| Styling    | Tailwind CSS v4 (CSS-first design tokens) |
| Backend    | Supabase (wired up in Phase 3)            |
| Animation  | Motion (`motion/react`)                   |
| Validation | Zod + `@t3-oss/env-nextjs`                |
| Tooling    | ESLint 9 · Prettier · Husky · lint-staged |
| Hosting    | Vercel (planned)                          |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local   # then fill in values as phases require

# 3. Run the dev server
npm run dev                  # http://localhost:3000
```

> Requires Node `>= 20.9` (see `.nvmrc` — the project is developed on Node 24).

## Scripts

| Script                 | Purpose                        |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Start the dev server           |
| `npm run build`        | Production build               |
| `npm run start`        | Serve the production build     |
| `npm run lint`         | Lint with ESLint               |
| `npm run lint:fix`     | Lint and auto-fix              |
| `npm run typecheck`    | Type-check with `tsc --noEmit` |
| `npm run format`       | Format with Prettier           |
| `npm run format:check` | Verify formatting              |

## Project structure

```
src/
├── app/            # App Router: routes, layout, globals.css, robots, sitemap
├── components/     # ui · brand · layout · sections   (built in later phases)
├── config/         # env (validated) + site config
├── content/        # content-as-code (later phases)
├── hooks/          # reusable client hooks
├── lib/            # utils · seo · motion · supabase clients
├── providers/      # app-wide React providers
└── types/          # domain + database types
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

| Document                                       | Covers                                            |
| ---------------------------------------------- | ------------------------------------------------- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Frontend/tooling decisions and their rationale    |
| [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)         | Tokens, components, motion, accessibility         |
| [`docs/BACKEND.md`](docs/BACKEND.md)           | Supabase setup, auth, roles, storage, patterns    |
| [`docs/DATABASE.md`](docs/DATABASE.md)         | Schema, relationships, migrations                 |
| [`docs/CMS.md`](docs/CMS.md)                   | Admin routing, layout, tables, forms, permissions |

> The backend is optional at runtime: without Supabase credentials the site
> still builds and renders. See `docs/BACKEND.md` to provision it.
