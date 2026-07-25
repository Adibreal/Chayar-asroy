import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType } from "react";

import type { PolymorphicProps } from "@/lib/polymorphic";
import { cn } from "@/lib/utils";

const container = cva("mx-auto w-full", {
  variants: {
    size: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-none",
    },
    gutter: {
      true: "px-[clamp(1rem,5vw,2.5rem)]",
      false: "",
    },
  },
  defaultVariants: { size: "xl", gutter: true },
});

type ContainerOwnProps = VariantProps<typeof container>;

/**
 * Centered, max-width page container with responsive side gutters.
 * The primary horizontal boundary for page content.
 */
export function Container<E extends ElementType = "div">({
  as,
  size,
  gutter,
  className,
  ...rest
}: PolymorphicProps<E, ContainerOwnProps>) {
  const Comp = (as ?? "div") as ElementType;
  return <Comp className={cn(container({ size, gutter }), className)} {...rest} />;
}
