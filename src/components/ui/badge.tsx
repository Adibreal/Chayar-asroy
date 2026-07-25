import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const badge = cva("inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap", {
  variants: {
    variant: {
      default: "bg-surface-sunken text-foreground",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      accent: "bg-accent text-accent-foreground",
      success: "bg-success text-white",
      warning: "bg-warning text-ink",
      danger: "bg-danger text-danger-foreground",
      outline: "border border-border-strong bg-transparent text-foreground",
    },
    size: {
      sm: "px-2 py-0.5 text-caption",
      md: "px-2.5 py-1 text-small",
    },
  },
  defaultVariants: { variant: "default", size: "sm" },
});

type BadgeProps = ComponentPropsWithoutRef<"span"> & VariantProps<typeof badge>;

/**
 * Small, non-interactive status/category label (e.g. ART, EDUCATION,
 * COMMUNITY). For interactive/removable tags use `Chip`.
 */
export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant, size }), className)} {...props} />;
}

export { badge as badgeVariants };
