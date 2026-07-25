/**
 * Shared Tailwind class fragments.
 *
 * Compose these into `cva()` base strings so interaction states stay identical
 * across every component (one definition, not copy-pasted). All values resolve
 * to semantic design tokens.
 */

/** Accessible, consistent keyboard-focus ring (WCAG 2.2 AA, 2px offset). */
export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Focus ring for elements flush to a container edge (rows, segmented items). */
export const focusRingInset =
  "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";

/** Standard disabled treatment for native + Radix controls. */
export const disabledStyles =
  "disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)] data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--opacity-disabled)]";

/** Calm, purposeful transition for interactive elements. */
export const transitionBase =
  "transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-brand)]";
