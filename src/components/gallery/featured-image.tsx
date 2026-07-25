import type { ReactNode } from "react";

import { Sun } from "../brand/motifs";
import { OrganicFrame } from "../brand/organic-frame";
import { Media } from "../media/media";
import { Floating } from "../motion/floating";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

/**
 * A large, framed showcase image with a floating decorative accent — for
 * section highlights and story headers.
 */
export function FeaturedImage({
  image,
  caption,
  className,
}: {
  image?: ImageAsset;
  caption?: ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("relative", className)}>
      <Floating className="absolute -top-6 -left-6 z-10 hidden md:block">
        <Sun className="size-12 text-marigold" />
      </Floating>
      <OrganicFrame shape="soft" className="aspect-[3/2] shadow-lg">
        <Media image={image} sizes="(min-width: 1024px) 60vw, 90vw" />
      </OrganicFrame>
      {caption ? (
        <figcaption className="mt-3 text-center text-small text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
