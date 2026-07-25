import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType } from "react";

import type { PolymorphicProps } from "@/lib/polymorphic";
import { cn } from "@/lib/utils";

const text = cva("", {
  variants: {
    variant: {
      lead: "text-lead",
      body: "text-body",
      small: "text-small",
      caption: "text-caption",
      quote: "font-display text-h4 italic",
      label: "text-caption font-semibold tracking-[0.12em] uppercase",
      code: "rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-small",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      onPrimary: "text-primary-foreground",
      inherit: "text-inherit",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: { variant: "body", tone: "default" },
});

type TextOwnProps = VariantProps<typeof text>;

/**
 * Body & supporting text. Polymorphic (`p` by default) — use `as="span"`,
 * `as="code"`, `as="label"`, etc. as the semantics require.
 */
export function Text<E extends ElementType = "p">({
  as,
  variant,
  tone,
  weight,
  className,
  ...rest
}: PolymorphicProps<E, TextOwnProps>) {
  const Comp = (as ?? "p") as ElementType;
  return <Comp className={cn(text({ variant, tone, weight }), className)} {...rest} />;
}
