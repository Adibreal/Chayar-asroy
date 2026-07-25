import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType } from "react";

import type { PolymorphicProps } from "@/lib/polymorphic";
import { cn } from "@/lib/utils";

import { alignClasses, gapClasses } from "./shared";

const stack = cva("flex flex-col", {
  variants: {
    gap: gapClasses,
    align: alignClasses,
  },
  defaultVariants: { gap: "md", align: "stretch" },
});

type StackOwnProps = VariantProps<typeof stack>;

/** Vertical flow: stacks children in a column with a consistent gap. */
export function Stack<E extends ElementType = "div">({
  as,
  gap,
  align,
  className,
  ...rest
}: PolymorphicProps<E, StackOwnProps>) {
  const Comp = (as ?? "div") as ElementType;
  return <Comp className={cn(stack({ gap, align }), className)} {...rest} />;
}
