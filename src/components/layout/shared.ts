/**
 * Shared scales for layout primitives, so gap/alignment vocabulary is
 * identical across Stack, Cluster, Grid, Split and Sidebar.
 */

export const gapClasses = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
} as const;

export const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const;

export const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const;

export type Gap = keyof typeof gapClasses;
export type Align = keyof typeof alignClasses;
export type Justify = keyof typeof justifyClasses;
