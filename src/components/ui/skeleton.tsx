import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const skeleton = cva("animate-pulse bg-surface-sunken", {
  variants: {
    variant: {
      text: "h-4 rounded-md",
      circle: "rounded-full",
      rect: "rounded-xl",
      block: "rounded-2xl",
    },
  },
  defaultVariants: { variant: "rect" },
});

type SkeletonProps = ComponentPropsWithoutRef<"div"> & VariantProps<typeof skeleton>;

/**
 * Content placeholder shown while data loads. Decorative (`aria-hidden`);
 * announce loading via a `role="status"` region at the section level. The pulse
 * halts automatically under `prefers-reduced-motion`.
 */
export function Skeleton({ variant, className, ...props }: SkeletonProps) {
  return <div aria-hidden className={cn(skeleton({ variant }), className)} {...props} />;
}
