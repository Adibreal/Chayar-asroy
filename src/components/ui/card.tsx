import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const card = cva("rounded-2xl bg-card text-card-foreground", {
  variants: {
    variant: {
      base: "border border-border",
      elevated: "border border-border/60 shadow-md",
      interactive:
        "border border-border shadow-sm transition-[transform,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-brand)] focus-within:-translate-y-1 focus-within:shadow-lg hover:-translate-y-1 hover:shadow-lg",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: { variant: "base", padding: "none" },
});

type CardProps = ComponentPropsWithoutRef<"div"> & VariantProps<typeof card>;

/**
 * Surface container. Three variants — `base`, `elevated`, `interactive` (lifts
 * on hover/focus-within, for cards wrapping a link). Compose with the sub-parts
 * below; keep root `padding="none"` when using them, or set padding for a
 * simple one-piece card.
 */
export function Card({ className, variant, padding, ...props }: CardProps) {
  return <div className={cn(card({ variant, padding }), className)} {...props} />;
}

export function CardMedia({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-t-2xl bg-surface-sunken",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<"h3">) {
  return <h3 className={cn("font-display text-h4 text-foreground", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return <p className={cn("text-small text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex items-center gap-3 p-6 pt-0", className)} {...props} />;
}

export { card as cardVariants };
