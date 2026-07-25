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
