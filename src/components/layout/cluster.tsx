import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType } from "react";

import type { PolymorphicProps } from "@/lib/polymorphic";
import { cn } from "@/lib/utils";

import { alignClasses, gapClasses, justifyClasses } from "./shared";

const cluster = cva("flex flex-wrap", {
  variants: {
    gap: gapClasses,
    align: alignClasses,
    justify: justifyClasses,
  },
  defaultVariants: { gap: "sm", align: "center", justify: "start" },
});

type ClusterOwnProps = VariantProps<typeof cluster>;

/**
 * Horizontal group that wraps gracefully — for tag lists, button rows, meta
 * items. Wrapping means it never overflows on small screens.
 */
export function Cluster<E extends ElementType = "div">({
  as,
  gap,
  align,
  justify,
  className,
  ...rest
}: PolymorphicProps<E, ClusterOwnProps>) {
  const Comp = (as ?? "div") as ElementType;
  return <Comp className={cn(cluster({ gap, align, justify }), className)} {...rest} />;
}
