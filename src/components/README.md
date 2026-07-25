# Components

The Chayar Asroy component system. Full reference — philosophy, tokens, usage,
do/don't — in [`DESIGN_SYSTEM.md`](../../DESIGN_SYSTEM.md).

## Foundations (Phase 3A)

| Folder        | Responsibility                                                        | Default        |
| ------------- | --------------------------------------------------------------------- | -------------- |
| `layout/`     | Structural primitives (Container, Section, Stack, Grid, Sidebar…)     | Server         |
| `typography/` | `Heading`, `Text`                                                     | Server         |
| `ui/`         | Universal components (buttons, cards, forms, feedback, overlays…)     | Server/Client¹ |
| `brand/`      | Motifs, `Logo`/`TreeMark`, decorations, `OrganicFrame`, social glyphs | Server         |
| `motion/`     | `Reveal`, `Floating`, `Stagger`, `AnimatedCounter`                    | Client         |

## Feature & section library (Phase 3B)

Composable, data-driven building blocks assembled into pages in later phases.
Nothing here is page-specific.

| Folder          | Components                                                                                |
| --------------- | ----------------------------------------------------------------------------------------- |
| `navigation/`   | `Header`, `Footer`, `MobileNav`, `NavLinks`, `SocialLinks`                                |
| `sections/`     | `SectionHeader`, `SectionIntro`, `SectionBackground`, `DecorativeLayer`, `SectionDivider` |
| `media/`        | `Media` (next/image + `ImageAsset`), `ImagePlaceholder`                                   |
| `hero/`         | `Hero`, `HeroContent`, `HeroBadge`, `HeroActions`, `HeroMedia`, `HeroStats`               |
| `projects/`     | `ProjectCard`, `ProjectGrid`, `FeaturedProjects`, `ProjectCategories`                     |
| `gallery/`      | `GalleryGrid`, `GalleryItem`, `Lightbox`, `FeaturedImage`                                 |
| `testimonials/` | `TestimonialCard`, `StoryCard`, `QuoteSection`                                            |
| `impact/`       | `Stat`, `ImpactMetrics`, `AchievementHighlight`                                           |
| `volunteer/`    | `OpportunityCard`, `VolunteerHighlights`, `VolunteerCTA`                                  |
| `contact/`      | `ContactCard`, `ContactInfo`, `SocialContact`                                             |
| `cta/`          | `CTASection`, `CTABanner`                                                                 |

¹ Interactive/Radix-backed components are Client Components; the rest are Server
Components.

## Conventions

- **Server Components by default**; `"use client"` only at interactive leaves.
- Consume **semantic** design tokens — never raw primitives or hardcoded hex.
- Feature components take **data via props** (see `src/types/content.ts`) and
  compose foundations — no bespoke flex/grid or one-off styling.
- Merge classes with `cn()`; define variants with `cva()`.
- Import from folder barrels (`@/components/ui`, `@/components/projects`, …).

## Showcase

`/showcase` (dev only — 404s in production) renders every component, variant,
and state for visual review: `src/app/(dev)/showcase/`.
