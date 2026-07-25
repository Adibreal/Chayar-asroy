# Chayar Asroy — Design System

The shared visual language and component library that every page inherits.
This document is the single reference for _how_ and _why_ the UI looks and
behaves the way it does.

> **Golden rule:** consume **semantic tokens** (`bg-background`, `text-primary`,
> `rounded-lg`) — never raw hex, never primitives. A component that follows this
> rule automatically adapts to theming (incl. the built-in dark mode) and stays
> consistent forever.

---

## 1. Brand philosophy

Chayar Asroy (ছায়ার আশ্রয়, "shelter of shade") is a student-led initiative giving
underprivileged children in Bangladesh room to create and grow. The identity
grows from the **tree logo** and the hand-crafted campaign posters.

Our design language balances two truths:

- **Warmth & childlike joy** — paper-cut illustration, organic shapes, hand-drawn
  motifs, a cream canvas.
- **Trust & editorial calm** — a confident serif, generous whitespace, restrained
  color, real photography.

**Evolution, not reinvention.** We keep the poster palette (cobalt, marigold,
forest, orange, cream), the serif voice, and the paper-cut motifs — and elevate
them with restraint, rhythm, accessible contrast, and consistency.

Design principles:

1. **Warm, never clinical.** Rounded forms, warm shadows, human language.
2. **Restraint is premium.** Whitespace ("shade") and few colors beat decoration.
3. **Dignity-first.** Children are creators, never objects of pity.
4. **Accessible by default.** WCAG 2.2 AA is a floor, not a feature.
5. **Motion is a whisper.** Calm, purposeful, and always reduced-motion aware.
6. **One system.** Tokens and primitives over one-off styling.

---

## 2. Color system

Defined in `src/app/globals.css` as three layers: **primitives → semantic
aliases → theme mapping**. Components use semantic roles only.

### Brand palette (primitives)

| Hue             | Role                         | Notes                             |
| --------------- | ---------------------------- | --------------------------------- |
| **Cobalt**      | Primary · trust anchor       | Buttons, links, focus ring        |
| **Marigold**    | Accent · energy              | **Fills only** — never small text |
| **Forest**      | Secondary · growth / success | Solid fills carry white text      |
| **Orange**      | Highlight · warmth           | Sparing accent                    |
| **Cream/Paper** | Background canvas            | Warm neutral base                 |
| **Ink**         | Text                         | Warm near-black                   |

### Semantic roles (use these)

`background`, `foreground`, `surface` / `surface-raised` / `surface-sunken` /
`surface-hover`, `card` / `card-foreground`, `primary` (+ `-foreground`,
`-hover`, `-active`, `-soft`), `secondary` (+ variants), `accent`, `highlight`,
`muted` / `muted-foreground`, `border` / `border-strong`, `input`, `ring`,
`success` / `warning` / `danger` (+ `danger-foreground`, `danger-soft`),
`overlay`.

### Contrast discipline (critical)

- **Marigold & orange are fills only.** Text on them must be `ink`/`foreground`.
- **Cobalt, forest, ink carry text.** Body text is `foreground` / `muted-foreground`.
- Every foreground/background pairing targets **≥ 4.5:1** (≥ 3:1 for large text).

### Dark mode

Built-in and ready (not yet toggled). Add `.dark` to `<html>` and only the
semantic layer flips — components never change. Keep authoring against semantic
tokens and dark mode "just works".

---

## 3. Typography

Two families (a third for Bengali), loaded via `next/font` (zero layout shift):

- **Display — Playfair Display (serif):** headings, quotes. The brand voice.
- **Body/UI — Inter (sans):** paragraphs, labels, controls.
- **Bengali — Noto Serif Bengali:** applied automatically to `:lang(bn)`.

### Fluid type scale (tokens → utilities)

`text-display`, `text-hero`, `text-h1`…`text-h6`, `text-lead`, `text-body`,
`text-small`, `text-caption` — each carries a tuned size, line-height, and (for
large sizes) letter-spacing, all fluid via `clamp()` for seamless
mobile→desktop scaling.

### Components

- **`<Heading level size>`** — semantic level (`<h1>`–`<h6>`) is **decoupled**
  from visual `size`, so the document outline stays correct regardless of looks.
- **`<Text variant tone weight as>`** — `lead` · `body` · `small` · `caption` ·
  `quote` · `label` · `code`, polymorphic via `as`.

```tsx
<Heading level={1} size="hero">Every child deserves a canvas</Heading>
<Text variant="lead" tone="muted">A student-led initiative…</Text>
```

---

## 4. Spacing, rhythm, radius, elevation

- **Spacing** uses Tailwind's 4px base scale; layout gaps go through the layout
  primitives' `gap` scale (`xs`…`2xl`) for one shared vocabulary.
- **Rhythm** — vertical rhythm is owned by `<Section spacing>`; horizontal bounds
  by `<Container size>`. Don't hand-roll section padding.
- **Radius** — generous & soft (`--radius-xs`…`3xl`); default surfaces use
  `rounded-2xl`, pills/controls use `rounded-full`/`rounded-lg`.
- **Elevation** — warm, ink-tinted shadows (`shadow-xs`…`xl`); never neutral grey.

---

## 5. Layout primitives (`components/layout`)

Composable, responsive, mostly server components. **Build pages by composing
these — don't write bespoke flex/grid.**

| Primitive   | Purpose                                                    |
| ----------- | ---------------------------------------------------------- |
| `Container` | Centered max-width wrapper + responsive gutters (`size`)   |
| `Section`   | Vertical rhythm band (`spacing`, `surface`)                |
| `Stack`     | Vertical flow with consistent `gap`/`align`                |
| `Cluster`   | Horizontal group that wraps (tags, button rows)            |
| `Grid`      | Fixed, responsive columns (`cols` 1–6, mobile-first)       |
| `AutoGrid`  | Content-driven columns (`min` track width, no breakpoints) |
| `Split`     | Two-column that stacks on mobile (`ratio`)                 |
| `Sidebar`   | Intrinsic sidebar + fluid main that wraps (no breakpoints) |
| `Flow`      | Owl-selector spacing for heterogeneous/prose content       |

All accept a polymorphic `as` prop. Example:

```tsx
<Section spacing="lg">
  <Container>
    <Grid cols={3} gap="lg">
      …
    </Grid>
  </Container>
</Section>
```

---

## 6. Core UI components (`components/ui`)

Every component: **variants · sizes · states · full keyboard a11y · dark-mode
ready · strongly typed**. Interactive/complex controls are built on **Radix**
primitives; variants use **CVA**; classes merge via `cn()`.

| Component                                                      | Highlights                                                                                                                                       |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Button**                                                     | `primary/secondary/accent/outline/ghost/text/destructive`, sizes `sm/md/lg/icon`, `loading`, `asChild` (accent = gold-on-cobalt, the poster CTA) |
| **Card** (+ Media/Header/Title/Description/Content/Footer)     | `base/elevated/interactive`                                                                                                                      |
| **Input · Textarea · Select · Checkbox · RadioGroup · Switch** | Labelled, invalid state, keyboard-complete                                                                                                       |
| **Label · Field**                                              | `Field` auto-wires `id`/`aria-describedby`/`aria-invalid`                                                                                        |
| **Badge · IconBadge**                                          | Status/category label; shared soft icon tile                                                                                                     |
| **Chip**                                                       | Toggle (`aria-pressed`) or removable                                                                                                             |
| **Avatar**                                                     | Image with initials fallback                                                                                                                     |
| **Tooltip**                                                    | Radix; provider already in `AppProviders`                                                                                                        |
| **Separator · Divider**                                        | Plain rule / labelled decorative break                                                                                                           |
| **Spinner · Skeleton · EmptyState**                            | Loading & empty states                                                                                                                           |
| **Blockquote**                                                 | Editorial pull-quote for testimonials                                                                                                            |

### Shared style fragments (`lib/styles.ts`)

`focusRing`, `focusRingInset`, `disabledStyles`, `transitionBase` — composed into
component base classes so interaction states are identical everywhere.

---

## 7. Brand assets (`components/brand`)

- **Motifs** — `Spiral`, `Star`, `Sun`, `Leaf`, `Sprout`, `Squiggle`, `Blob`.
  Single-color (`currentColor`), sized via `className`, decorative (`aria-hidden`)
  by default. **Punctuation, not wallpaper.**
- **`OrganicFrame`** — the signature image treatment: masks media into a soft
  paper-cut shape (never a plain rectangle).

_These are a working set; final artwork is reconciled against the vector logo._

---

## 8. Motion (`lib/motion` + `components/motion`)

Calm, elegant, purposeful — never distracting. Timing tokens live in
`lib/motion/tokens.ts` and mirror the CSS `--duration-*` / `--ease-*` tokens.

- **Variants:** `fadeIn`, `fadeInUp/Down/Left/Right`, `scaleIn`, `reveal`,
  `staggerContainer`/`staggerItem`.
- **Interaction presets:** `hoverLift`, `hoverScale`, `pressScale`.
- **Components:** `<Reveal>` (scroll-in) and `<Floating>` (gentle decorative bob).
- **Reduced motion:** `MotionConfig reducedMotion="user"` (global) neutralises
  transform/opacity motion; `<Floating>` renders fully static; a CSS safety net
  also kills animations. _Note:_ wrap only **non-critical** content in `<Reveal>`.

---

## 9. Accessibility (WCAG 2.2 AA)

- Semantic HTML; correct heading outline (via `Heading level`); landmarks.
- Every interactive element is keyboard-operable with a **visible focus ring**
  (`focusRing`).
- Radix powers focus management, ARIA, and dismiss behaviour for overlays.
- `Field` guarantees label association + error announcement (`role="alert"`,
  `aria-invalid`, `aria-describedby`).
- Contrast-checked token roles; **images require `alt`** (enforced in the type
  model).
- Icon-only buttons (`size="icon"`) **must** receive an `aria-label`.
- `prefers-reduced-motion` respected everywhere.

---

## 10. Do & Don't

| ✅ Do                                          | 🚫 Don't                                          |
| ---------------------------------------------- | ------------------------------------------------- |
| `bg-primary`, `text-foreground`                | `bg-[#2b33a4]`, raw hex, primitives in components |
| Put text on marigold in `ink`/`foreground`     | Small marigold/orange text (fails contrast)       |
| Compose `Section` + `Container` + layout prims | Hand-roll bespoke flex/grid padding               |
| `Heading level` for outline, `size` for looks  | Pick a heading tag purely for its font size       |
| Icon button → `aria-label`; images → `alt`     | Ship icon-only controls / images with no label    |
| Motifs as sparse punctuation                   | Scatter motifs as busy wallpaper                  |
| Wrap decorative reveals in `<Reveal>`          | Hide essential content behind scroll animation    |
| Add `"use client"` only at interactive leaves  | Mark whole trees client "just in case"            |

---

## 11. File map

```
src/
├── app/globals.css              # tokens: color · type scale · radius · shadow · motion · dark mode
├── lib/
│   ├── styles.ts                # shared class fragments (focus, disabled, transition)
│   ├── polymorphic.ts           # PolymorphicProps helper
│   └── motion/{tokens,variants} # motion language
└── components/
    ├── layout/                  # Container, Section, Stack, Cluster, Grid, AutoGrid, Split, Sidebar, Flow
    ├── typography/              # Heading, Text
    ├── ui/                      # buttons, cards, forms, badges, chips, avatar, tooltip, feedback…
    ├── brand/                   # motifs + OrganicFrame
    └── motion/                  # Reveal, Floating
```

Import from the folder barrels, e.g. `import { Button, Card } from "@/components/ui"`.
