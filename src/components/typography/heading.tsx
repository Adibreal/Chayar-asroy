import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, Ref } from "react";

import { cn } from "@/lib/utils";

const heading = cva("font-display text-balance text-foreground", {
  variants: {
    size: {
      display: "text-display font-semibold",
      hero: "text-hero font-semibold",
      h1: "text-h1 font-semibold",
      h2: "text-h2 font-semibold",
      h3: "text-h3 font-medium",
      h4: "text-h4 font-medium",
      h5: "text-h5 font-medium",
      h6: "text-h6 font-semibold tracking-wide uppercase",
    },
  },
  defaultVariants: { size: "h2" },
});

type Level = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = NonNullable<VariantProps<typeof heading>["size"]>;

const levelToSize: Record<Level, HeadingSize> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

type HeadingProps = Omit<ComponentPropsWithoutRef<"h2">, "color"> & {
  /** Semantic heading level (renders `<h1>`–`<h6>`). Choose for document outline. */
  level?: Level;
  /** Visual size, decoupled from level. Defaults to match `level`. */
  size?: HeadingSize;
  ref?: Ref<HTMLHeadingElement>;
};

/**
 * Semantic heading with visual size decoupled from level — so the document
 * outline stays correct even when a small heading needs to look large (or vice
 * versa). Renders the display serif.
 */
export function Heading({ level = 2, size, className, ref, ...rest }: HeadingProps) {
  const Tag = `h${level}` as `h${Level}`;
  return (
    <Tag
      ref={ref}
      className={cn(heading({ size: size ?? levelToSize[level] }), className)}
      {...rest}
    />
  );
}
