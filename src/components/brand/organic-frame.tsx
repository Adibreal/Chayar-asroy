import type { ComponentPropsWithoutRef, CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * Signature image treatment: masks content into a soft, organic "paper-cut"
 * shape (never a plain rectangle). Wrap a `next/image` (or any media) with it.
 *
 * @example
 * <OrganicFrame shape="pebble" className="aspect-4/5">
 *   <Image src={…} alt="…" fill className="object-cover" />
 * </OrganicFrame>
 */
/**
 * `soft`, `pebble` and `petal` are true blobs: their radii consume the whole of
 * every edge, so the outline never touches a corner and the silhouette reads as
 * torn paper. Perfect for illustration and detail crops.
 *
 * Using one on a **photograph** costs you its edges, and the cost is worst
 * where a group shot puts its subjects — along the horizontal extremes. The
 * homepage hero accepts that deliberately (see `HeroMedia`), but it is a design
 * decision to make with eyes open, not a default: check what the outline
 * removes before masking a picture with one. A tuned variant that keeps a
 * straight run down each side is the alternative if a photo can't afford it.
 */
const shapes = {
  soft: "42% 58% 63% 37% / 45% 38% 62% 55%",
  pebble: "62% 38% 46% 54% / 54% 60% 40% 46%",
  petal: "70% 30% 70% 30% / 30% 60% 40% 70%",
} as const;

type OrganicFrameProps = ComponentPropsWithoutRef<"div"> & {
  shape?: keyof typeof shapes;
};

export function OrganicFrame({ shape = "soft", className, style, ...rest }: OrganicFrameProps) {
  const frameStyle: CSSProperties = {
    borderRadius: shapes[shape],
    ...style,
  };
  return <div className={cn("relative overflow-hidden", className)} style={frameStyle} {...rest} />;
}
