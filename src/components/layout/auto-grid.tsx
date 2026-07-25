import type { CSSProperties, ElementType } from "react";

import type { PolymorphicProps } from "@/lib/polymorphic";
import { cn } from "@/lib/utils";

import { type Gap, gapClasses } from "./shared";

type AutoGridOwnProps = {
  /** Minimum track width before columns wrap (e.g. "16rem", "280px"). */
  min?: string;
  gap?: Gap;
};

/**
 * Content-driven responsive grid using `auto-fill` + `minmax`. Columns are
 * derived from available width and the `min` track size — no breakpoints
 * needed. `min(100%, …)` guarantees it never overflows on narrow screens.
 */
export function AutoGrid<E extends ElementType = "div">({
  as,
  min = "16rem",
  gap = "lg",
  className,
  style,
  ...rest
}: PolymorphicProps<E, AutoGridOwnProps>) {
  const Comp = (as ?? "div") as ElementType;
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${min}), 1fr))`,
    ...(style as CSSProperties),
  };
  return <Comp className={cn("grid", gapClasses[gap], className)} style={gridStyle} {...rest} />;
}
