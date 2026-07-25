import type { ElementType } from "react";

import type { PolymorphicProps } from "@/lib/polymorphic";
import { cn } from "@/lib/utils";

import { type Align, alignClasses, type Gap, gapClasses } from "./shared";

type Ratio = "1-1" | "1-2" | "2-1" | "1-3" | "3-1" | "2-3" | "3-2";

/** Column templates applied from `md` up; a single column below that. */
const ratioClasses: Record<Ratio, string> = {
  "1-1": "md:grid-cols-2",
  "1-2": "md:grid-cols-[1fr_2fr]",
  "2-1": "md:grid-cols-[2fr_1fr]",
  "1-3": "md:grid-cols-[1fr_3fr]",
  "3-1": "md:grid-cols-[3fr_1fr]",
  "2-3": "md:grid-cols-[2fr_3fr]",
  "3-2": "md:grid-cols-[3fr_2fr]",
};

type SplitOwnProps = { ratio?: Ratio; gap?: Gap; align?: Align };

/**
 * Two-column split that collapses to a single stacked column on mobile.
 * Expects exactly two children.
 */
export function Split<E extends ElementType = "div">({
  as,
  ratio = "1-1",
  gap = "lg",
  align = "start",
  className,
  ...rest
}: PolymorphicProps<E, SplitOwnProps>) {
  const Comp = (as ?? "div") as ElementType;
  return (
    <Comp
      className={cn(
        "grid grid-cols-1",
        ratioClasses[ratio],
        gapClasses[gap],
        alignClasses[align],
        className,
      )}
      {...rest}
    />
  );
}
