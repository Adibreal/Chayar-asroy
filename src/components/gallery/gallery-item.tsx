"use client";

import { Media } from "../media/media";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

import { Lightbox } from "./lightbox";

/**
 * Relaxed gallery item shape — `image` is optional so the UI can render a
 * branded placeholder. Real data always supplies it; consent is enforced by the
 * data layer and by `GalleryGrid` (`consentVerified`).
 */
export type GalleryItemData = {
  id: string;
  image?: ImageAsset;
  caption?: string;
  consentVerified?: boolean;
};

/**
 * A single, keyboard-focusable gallery thumbnail that opens in the lightbox.
 */
export function GalleryItem({ item, className }: { item: GalleryItemData; className?: string }) {
  const label = item.caption ? `View image: ${item.caption}` : (item.image?.alt ?? "View image");

  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <Lightbox image={item.image} caption={item.caption}>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "group relative block aspect-square w-full overflow-hidden rounded-2xl",
            focusRing,
          )}
        >
          <Media
            image={item.image}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="transition-transform duration-[var(--duration-slow)] ease-[var(--ease-brand)] group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-ink/0 transition-colors duration-[var(--duration-normal)] group-hover:bg-ink/15" />
        </button>
      </Lightbox>
      {item.caption ? (
        <figcaption className="text-center text-small text-muted-foreground">
          {item.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
