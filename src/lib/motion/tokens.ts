/**
 * Motion tokens — the single source of truth for animation timing.
 *
 * Durations are in SECONDS (Motion's unit). They mirror the millisecond
 * `--duration-*` CSS variables in globals.css so CSS transitions and JS
 * animations stay visually in sync.
 *
 * Easing values are cubic-bezier control points, mirroring the `--ease-*`
 * tokens in globals.css.
 */

export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  slower: 0.6,
} as const;

type Cubic = [number, number, number, number];

export const easing = {
  /** Smooth, confident deceleration — the default brand feel. */
  brand: [0.22, 1, 0.36, 1] as Cubic,
  /** Gentle ease-out for entrances. */
  outSoft: [0.16, 1, 0.3, 1] as Cubic,
  /** Balanced ease-in-out for looping / reversible motion. */
  inOutSoft: [0.65, 0, 0.35, 1] as Cubic,
} as const;

export type DurationToken = keyof typeof duration;
export type EasingToken = keyof typeof easing;
