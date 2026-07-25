import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType } from "react";

import type { PolymorphicProps } from "@/lib/polymorphic";
import { cn } from "@/lib/utils";

const section = cva("", {
  variants: {
    spacing: {
      none: "py-0",
      sm: "py-8 sm:py-10",
      md: "py-12 sm:py-16",
      lg: "py-16 sm:py-24",
      xl: "py-24 sm:py-32",
    },
    surface: {
      none: "",
      base: "bg-background text-foreground",
      muted: "bg-surface text-foreground",
      sunken: "bg-surface-sunken text-foreground",
      primary: "bg-primary text-primary-foreground",
    },
  },
  defaultVariants: { spacing: "lg", surface: "none" },
});

type SectionOwnProps = VariantProps<typeof section>;

/**
 * A page section that establishes vertical rhythm. Renders `<section>` by
 * default. Pair with `<Container>` inside for horizontal bounds.
 */
export function Section<E extends ElementType = "section">({
  as,
  spacing,
  surface,
  className,
  ...rest
}: PolymorphicProps<E, SectionOwnProps>) {
  const Comp = (as ?? "section") as ElementType;
  return <Comp className={cn(section({ spacing, surface }), className)} {...rest} />;
}
