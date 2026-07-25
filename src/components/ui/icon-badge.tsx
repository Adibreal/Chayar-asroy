import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const iconBadge = cva("grid shrink-0 place-items-center rounded-2xl", {
  variants: {
    size: {
      sm: "size-10 [&_svg]:size-5",
      md: "size-12 [&_svg]:size-6",
      lg: "size-14 [&_svg]:size-7",
    },
    tone: {
      primary: "bg-primary-soft text-primary",
      secondary: "bg-secondary/15 text-secondary",
      accent: "bg-accent/20 text-ink",
      muted: "bg-surface-sunken text-muted-foreground",
    },
  },
  defaultVariants: { size: "md", tone: "primary" },
});

type IconBadgeProps = ComponentPropsWithoutRef<"span"> & VariantProps<typeof iconBadge>;

/**
 * A soft, rounded tile that holds an icon — the shared "feature icon" chip used
 * across achievements, opportunities, and contact methods. One definition keeps
 * icon sizing and color consistent everywhere.
 */
export function IconBadge({ className, size, tone, ...props }: IconBadgeProps) {
  return <span className={cn(iconBadge({ size, tone }), className)} {...props} />;
}
