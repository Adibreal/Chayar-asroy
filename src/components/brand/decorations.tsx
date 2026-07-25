import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

import { Leaf, Sprout } from "./motifs";

/**
 * A small cluster of leaves at playful angles — decorative punctuation for
 * section corners and card accents. Decorative (`aria-hidden`).
 */
export function LeafCluster({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div aria-hidden className={cn("pointer-events-none relative", className)} {...props}>
      <Leaf className="absolute -top-1 left-0 size-6 -rotate-12 text-forest/70" />
      <Leaf className="absolute top-2 left-5 size-8 rotate-6 text-secondary" />
      <Leaf className="absolute top-0 left-11 size-5 rotate-45 text-marigold" />
    </div>
  );
}

/**
 * A horizontal divider with the brand sprout centered — a warm, organic break
 * between content blocks.
 */
export function TreeDivider({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-hidden
      className={cn("flex items-center gap-4 text-muted-foreground", className)}
      {...props}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
      <Sprout className="size-6 shrink-0 text-secondary" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
    </div>
  );
}
