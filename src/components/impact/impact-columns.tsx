"use client";

import { Heart } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { type ReactNode, useCallback, useState } from "react";

import { Branch } from "../brand/motifs";
import { AnimatedCounter } from "../motion/animated-counter";
import { duration, easing } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

import { impactIcons, type ImpactIconName } from "./impact-icons";

export type ImpactEntry = {
  /** Numeric values count up in view; strings render as-is. */
  value: number | string;
  /** Kept deliberately short — the number leads, the label only names it. */
  label: string;
  prefix?: string;
  suffix?: string;
  icon?: ImpactIconName;
};

/* --------------------------------------------------------------------------
 * Motion
 *
 * The sequence is a set of self-triggering elements with explicit delays, not a
 * parent that staggers its children. Each animates once as it arrives.
 *
 * Only `opacity` and `transform` (y / x / scaleX / rotate) are animated — both
 * composited on the GPU, so nothing triggers layout or paint. No `width`,
 * `height`, `top` or `left` anywhere. The one blur is static, so it rasterises
 * once and is never re-painted mid-animation.
 *
 * Motion's global `reducedMotion="user"` (MotionProvider) neutralises transform
 * motion for anyone who asks, and `AnimatedCounter` jumps straight to its final
 * value in that case.
 * ------------------------------------------------------------------------ */

const ease = easing.outSoft;

/**
 * Shared viewport rule: fire as the element arrives, once only, never replaying
 * on scroll-back.
 */
const once = { once: true, amount: "some" } as const;

/**
 * Each animated element triggers itself with an explicit `delay`, rather than
 * inheriting a variant from a staggering parent.
 *
 * That is deliberate: parent→child variant propagation was verified *not* to
 * reach these children in this tree (the root reached `visible` while every
 * child stayed hidden), and self-triggering is the pattern already proven
 * across this codebase by `<Reveal>`. Explicit delays also make the
 * choreography readable — the running order is right here in the numbers.
 */
function step(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: duration.slower, ease, delay } },
  };
}

/* Running order, in seconds. Reading these top-to-bottom is the choreography. */
const TITLE_DELAY = 0.05;
const DIVIDER_DELAY = 0.18;
const INTRO_DELAY = 0.26;
const HEART_DELAY = 0.36;
const COLUMN_BASE = 0.44;
/** 110ms between columns — inside the 80–120ms band that reads as deliberate. */
const COLUMN_STAGGER = 0.11;

/** The decorative branch drifts in rather than appearing. */
const driftIn: Variants = {
  hidden: { opacity: 0, x: -18, rotate: -6 },
  visible: { opacity: 1, x: 0, rotate: 0, transition: { duration: 1.1, ease } },
};

/** Divider grows from its centre — `scaleX`, never `width`, so no layout cost. */
function growFromCenter(delay: number): Variants {
  return {
    hidden: { opacity: 0, scaleX: 0 },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: { duration: duration.slower, ease, delay },
    },
  };
}

/**
 * The impact section.
 *
 * Layout is fixed by design: a centred editorial header, four columns divided
 * by hairline rules, and a closing quote. This component's job is the motion —
 * a single choreographed entrance that runs **once**, plus restrained hover
 * feedback.
 *
 * CMS-ready: everything is passed as data. Phase 5D swaps the source for
 * `impact_stats` without touching this file.
 */

/**
 * Column count at the widest breakpoint, capped at five.
 *
 * Five is the ceiling because it is the last count where a column still holds
 * the longest value the ledger renders — a money figure like `৳45,000` — at a
 * size that reads as a headline. Beyond five, further metrics wrap onto a
 * second row instead of shrinking further.
 */
function columnsAtWidest(count: number): number {
  return Math.min(count, 5);
}

/**
 * Width of a single column, for a given number of metrics.
 *
 * The count is whatever the CMS publishes, so the column width follows it
 * rather than assuming a fixed number — publishing three used to leave an empty
 * fourth column that pushed the group off-centre. Written as whole class
 * strings because Tailwind only generates classes it can see literally.
 *
 * Five steps down through three and two rather than jumping straight from one:
 * a five-up row at `md` leaves roughly 150px a column, which is narrower than
 * the money figure itself.
 */
function columnWidthClasses(count: number): string {
  switch (columnsAtWidest(count)) {
    case 1:
      return "w-full";
    case 2:
      return "w-full sm:w-1/2";
    case 3:
      // Two up on a small tablet, three once there is room — so three metrics
      // never leave a lone item stranded on a second row.
      return "w-full sm:w-1/2 md:w-1/3";
    case 4:
      return "w-full sm:w-1/2 lg:w-1/4";
    default:
      return "w-full sm:w-1/2 md:w-1/3 lg:w-1/5";
  }
}

export function ImpactColumns({
  eyebrow,
  title,
  description,
  entries,
  quote,
  quoteAttribution,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  entries: ImpactEntry[];
  quote?: string;
  quoteAttribution?: string;
  className?: string;
}) {
  if (entries.length === 0) return null;

  return (
    <div className={cn("relative isolate", className)}>
      {/* Decorative branches, drifting in from the outer edges. */}
      <motion.div
        variants={driftIn}
        initial="hidden"
        whileInView="visible"
        viewport={once}
        aria-hidden
        className="pointer-events-none absolute -top-6 -left-4 hidden text-forest/20 lg:block"
      >
        <Branch className="h-auto w-40 -rotate-12" />
      </motion.div>
      <motion.div
        variants={driftIn}
        initial="hidden"
        whileInView="visible"
        viewport={once}
        aria-hidden
        className="pointer-events-none absolute -right-4 -bottom-4 hidden text-forest/15 lg:block"
      >
        <Branch className="h-auto w-36 rotate-[168deg]" />
      </motion.div>

      {/* Header. The wrapper is wide enough for an editorial paragraph; the
          headline is reined back separately so it still breaks in a
          considered place. */}
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
        {eyebrow ? (
          <motion.p
            variants={step(0)}
            initial="hidden"
            whileInView="visible"
            viewport={once}
            className="text-caption font-semibold tracking-[0.18em] text-primary uppercase"
          >
            {eyebrow}
          </motion.p>
        ) : null}

        <motion.span
          variants={growFromCenter(DIVIDER_DELAY)}
          initial="hidden"
          whileInView="visible"
          viewport={once}
          aria-hidden
          className="block h-px w-24 origin-center bg-border-strong"
        />

        <motion.h2
          variants={step(TITLE_DELAY)}
          initial="hidden"
          whileInView="visible"
          viewport={once}
          className="max-w-2xl font-display text-h1 text-balance text-foreground"
        >
          {title}
        </motion.h2>

        {description ? (
          <motion.p
            variants={step(INTRO_DELAY)}
            initial="hidden"
            whileInView="visible"
            viewport={once}
            /* `text-pretty` rather than `text-balance`: balancing squeezes a
               multi-line paragraph into a narrow block, which is exactly the
               cramped look we're fixing. Pretty only guards against orphans. */
            className="max-w-3xl text-lead text-pretty text-muted-foreground"
          >
            {description}
          </motion.p>
        ) : null}

        <motion.span
          variants={growFromCenter(HEART_DELAY)}
          initial="hidden"
          whileInView="visible"
          viewport={once}
          aria-hidden
          className="mt-2 flex origin-center items-center gap-3 text-primary"
        >
          <span className="h-px w-16 bg-border-strong" />
          <Heart className="size-4" />
          <span className="h-px w-16 bg-border-strong" />
        </motion.span>
      </div>

      {/* Columns
       *
       * More air above them than the header carries: the numbers are large, so
       * they need room to land rather than crowd what introduces them.
       *
       * Flex rather than grid, so a partly-filled final row centres itself. A
       * five-up ledger wraps to 3 + 2 at `md`, and CSS Grid packs that trailing
       * pair into the first two tracks, hard against the left edge — the
       * "orphan row" this section lived with while it topped out at four. The
       * widths are exact percentages totalling 100%, so the widest breakpoint
       * still lays out exactly as a grid would. */}
      <dl
        className={cn(
          "mt-16 flex flex-wrap justify-center gap-y-14 sm:gap-y-16",
          // Only collapse the row gap while everything fits on one row.
          entries.length <= columnsAtWidest(entries.length) && "lg:gap-y-0",
        )}
      >
        {entries.map((entry, index) => (
          <ImpactColumn
            key={entry.label}
            entry={entry}
            widthClassName={columnWidthClasses(entries.length)}
            // Five up is the tightest the row ever gets, and the only count
            // that retunes the figure and the icon to keep a column breathing.
            isFiveUp={columnsAtWidest(entries.length) === 5}
            // Starts a row, so it must not carry a left separator. Derived from
            // the real column count rather than "is it the very first", which
            // put a stray divider at the start of any wrapped row.
            isRowStart={index % columnsAtWidest(entries.length) === 0}
            delay={COLUMN_BASE + index * COLUMN_STAGGER}
          />
        ))}
      </dl>

      {/* Closing quote */}
      {quote ? (
        <motion.figure
          variants={step(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={once}
          className="mx-auto mt-16 flex max-w-xl flex-col items-center gap-2 text-center"
        >
          <span aria-hidden className="font-display text-3xl leading-none text-primary/40">
            &ldquo;
          </span>
          <blockquote className="font-display text-h5 text-balance text-foreground italic">
            {quote}
          </blockquote>
          {quoteAttribution ? (
            <figcaption className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
              — {quoteAttribution}
            </figcaption>
          ) : null}
        </motion.figure>
      ) : null}
    </div>
  );
}

/**
 * One column. Local state exists only to time the glow to the end of its own
 * count-up — it is not shared, so a pulse never re-renders its siblings.
 */
function ImpactColumn({
  entry,
  widthClassName,
  isFiveUp,
  isRowStart,
  delay,
}: {
  entry: ImpactEntry;
  /** Exact percentage width for this metric count's breakpoint ladder. */
  widthClassName: string;
  /** Five columns at the widest breakpoint — the tightest configuration. */
  isFiveUp: boolean;
  /** First column of its row — carries no left separator. */
  isRowStart: boolean;
  delay: number;
}) {
  const [hasCounted, setHasCounted] = useState(false);
  const Icon = entry.icon ? impactIcons[entry.icon] : null;

  const readable = `${entry.prefix ?? ""}${
    typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value
  }${entry.suffix ?? ""}`;

  // Stable identity so the counter's effect doesn't re-run every render.
  const handleComplete = useCallback(() => setHasCounted(true), []);

  return (
    <motion.div
      variants={step(delay)}
      initial="hidden"
      whileInView="visible"
      viewport={once}
      className={cn(
        // No `gap`: each element owns its own margin, so the number can sit
        // tight to its label while the icon keeps its distance above.
        "group relative flex flex-col items-center px-6 text-center",
        widthClassName,
        // Five up leaves ~240px a column at the container's full width. Some of
        // the side padding goes back to the figure rather than to empty space
        // beside the divider — the divider's own breathing room is the gap
        // between columns, not this padding.
        isFiveUp && "lg:px-4",
        // Hairline separators between columns; never at the start of a row.
        !isRowStart && "lg:border-l lg:border-border",
      )}
    >
      {Icon ? (
        <motion.span
          variants={step(delay + 0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={once}
          aria-hidden
          className={cn(
            // 76px / 38px — the tile and its glyph scaled together by ~19%, so
            // the icon gains presence without changing its proportion inside
            // the circle. Exact values rather than the next scale step, which
            // would have jumped 25%.
            "grid size-[4.75rem] place-items-center rounded-full bg-surface-sunken/70 text-primary",
            // Five up: 64px / 32px — the same 2:1 tile-to-glyph proportion,
            // stepped down alongside the number so the circle never ends up
            // outweighing the figure it introduces.
            isFiveUp && "lg:size-16",
            // Hover: a small lift. Transform only.
            "transition-transform duration-[var(--duration-normal)] ease-[var(--ease-brand)]",
            "group-hover:-translate-y-1",
          )}
        >
          <Icon className={cn("size-[2.375rem]", isFiveUp && "lg:size-8")} />
        </motion.span>
      ) : null}

      {/* Number + glow. Generous space above it, almost none below — the label
          should read as attached to its number, not as a sibling. */}
      <dd className={cn("relative mt-6", isFiveUp && "lg:mt-5")}>
        {/* One-shot glow, fired when this column's count settles. Opacity and
            scale only; the blur is static so nothing re-rasterises mid-animation. */}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.6 }}
          animate={hasCounted ? { opacity: [0, 0.55, 0], scale: [0.6, 1.25, 1.5] } : undefined}
          transition={{ duration: 1.4, ease: easing.brand, times: [0, 0.35, 1] }}
          className="pointer-events-none absolute inset-0 -z-10 m-auto size-24 rounded-full bg-primary/40 blur-2xl"
        />

        <span
          aria-hidden
          className={cn(
            // The `--text-display` clamp scaled down 10% on every term, so it
            // stays fluid across breakpoints instead of only shrinking at one
            // size. Kept local rather than editing the shared token, which
            // other sections rely on. Tight tracking keeps big numerals from
            // feeling loose.
            "block font-display text-[clamp(2.925rem,1.98rem+4.68vw,4.95rem)] leading-[0.9] font-semibold tracking-tight text-primary tabular-nums",
            // Five up, from `lg` — the breakpoint where the row actually
            // becomes five wide, so the smaller ladders keep the full size.
            // Sized against `৳45,000`, the longest string the ledger renders:
            // ~40px at 1024px, ~53px once the container caps at 1280px, both
            // with room to spare in the column. Only this case is retuned;
            // one through four keep the proven sizing untouched.
            isFiveUp && "lg:text-[clamp(2.5rem,0.5rem+3.1vw,3.3rem)]",
            "transition-transform duration-[var(--duration-normal)] ease-[var(--ease-brand)]",
            "group-hover:scale-[1.02]",
          )}
        >
          {entry.prefix}
          {typeof entry.value === "number" ? (
            <AnimatedCounter value={entry.value} delay={delay + 0.2} onComplete={handleComplete} />
          ) : (
            entry.value
          )}
          {entry.suffix}
        </span>
        {/* The real value, announced once, independent of the animation. */}
        <span className="sr-only">{readable}</span>
      </dd>

      {/* The label settles after the number has begun counting — same beat as
          before, now carrying the label alone. */}
      <motion.dt
        variants={step(delay + 0.34)}
        initial="hidden"
        whileInView="visible"
        viewport={once}
        className={cn(
          "mt-3 font-display text-h5 text-balance text-foreground",
          "transition-transform duration-[var(--duration-normal)] ease-[var(--ease-brand)]",
          "group-hover:-translate-y-0.5",
        )}
      >
        {entry.label}
      </motion.dt>
    </motion.div>
  );
}
