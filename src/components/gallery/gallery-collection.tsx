"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

import { GalleryGrid } from "./gallery-grid";
import { GalleryLightbox } from "./gallery-lightbox";
import type { GalleryItemData } from "./gallery-item";

type GalleryCollectionProps = {
  items: GalleryItemData[];
  /** Names the collection for assistive tech, e.g. the programme title. */
  label: string;
  /**
   * How many thumbnails to show before offering "View all images". Omit to
   * show every image and no button — the whole-gallery case.
   */
  previewCount?: number;
  className?: string;
};

/**
 * A set of images that opens into the full-screen browser.
 *
 * One implementation serves both callers: a programme page passes
 * `previewCount` and gets a preview grid plus a "view all" button; `/gallery`
 * passes none and gets every image, each opening the lightbox at its own
 * index. There is deliberately no second gallery or second lightbox — the
 * difference between the two pages is a prop, not a component.
 *
 * It is a client component purely to hold "which image is open". Each instance
 * owns its own state, so two collections on one page stay independent.
 */
export function GalleryCollection({
  items,
  label,
  previewCount,
  className,
}: GalleryCollectionProps) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  // Filter here, with the same rule `GalleryGrid` applies, so the index the
  // grid reports always lines up with the array the lightbox pages through.
  const visible = items.filter((item) => item.consentVerified !== false);
  if (visible.length === 0) return null;

  const preview = previewCount === undefined ? visible : visible.slice(0, previewCount);
  const hasMore = visible.length > preview.length;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <GalleryGrid items={preview} onSelect={(index) => setOpenAt(index)} />

      {previewCount === undefined ? null : (
        <div className="flex justify-center">
          <Button type="button" variant="outline" onClick={() => setOpenAt(0)}>
            {hasMore ? `View all ${visible.length} images` : "View all images"}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      )}

      <GalleryLightbox
        items={visible}
        openAt={openAt}
        onClose={() => setOpenAt(null)}
        label={label}
      />
    </div>
  );
}
