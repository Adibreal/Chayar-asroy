import Image from "next/image";

import { Blob, Star } from "../brand/motifs";
import { PaperCutTree } from "../brand/paper-cut-tree";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

/**
 * Branded fallback shown when no image is provided — a layered paper-cut scene
 * rather than a lonely icon, so the page still reads as handcrafted while real
 * photography is pending. Everything scales in percentages, so it composes
 * correctly from a small gallery thumbnail up to the hero.
 */
export function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative grid size-full place-items-center overflow-hidden bg-surface-sunken",
        className,
      )}
    >
      <Blob className="absolute -top-[30%] -left-[26%] h-auto w-[75%] text-marigold/15" />
      <Blob className="absolute -right-[28%] -bottom-[32%] h-auto w-[65%] text-forest/10" />
      <Star className="absolute top-[13%] right-[15%] h-auto w-[7%] text-marigold/50" />
      <Star className="absolute bottom-[16%] left-[13%] h-auto w-[5%] text-terracotta/40" />
      <PaperCutTree className="relative w-[46%] max-w-44 min-w-16" />
    </div>
  );
}

type MediaProps = {
  image?: ImageAsset;
  /** Responsive `sizes` hint for the optimizer. */
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Fill image wrapper around `next/image` for our `ImageAsset` shape (AVIF/WebP,
 * responsive, optional blur placeholder). **Must** be placed inside a
 * positioned, sized parent (e.g. an aspect container or `OrganicFrame`). Falls
 * back to a branded placeholder when `image` is absent.
 */
export function Media({ image, sizes, priority, className }: MediaProps) {
  if (!image) return <ImagePlaceholder className={className} />;
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={image.blurDataURL ? "blur" : "empty"}
      blurDataURL={image.blurDataURL}
      className={cn("object-cover", className)}
    />
  );
}
