import type { ElementType } from "react";

import type { PolymorphicProps } from "@/lib/polymorphic";
import { cn } from "@/lib/utils";

import { type Gap, gapClasses } from "./shared";

type Cols = 1 | 2 | 3 | 4 | 5 | 6;

/** Explicit, responsive column counts (mobile-first: fewer columns on small screens). */
const colsClasses: Record<Cols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

type GridOwnProps = { cols?: Cols; gap?: Gap };

/** Fixed, responsive column grid. Use `<AutoGrid>` when item width should drive columns. */
export function Grid<E extends ElementType = "div">({
  as,
  cols = 3,
  gap = "lg",
  className,
  ...rest
}: PolymorphicProps<E, GridOwnProps>) {
  const Comp = (as ?? "div") as ElementType;
  return <Comp className={cn("grid", colsClasses[cols], gapClasses[gap], className)} {...rest} />;
}
