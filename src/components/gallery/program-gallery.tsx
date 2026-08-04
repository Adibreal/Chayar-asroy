"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

import { GalleryGrid } from "./gallery-grid";
import { GalleryLightbox } from "./gallery-lightbox";
import type { GalleryItemData } from "./gallery-item";

type ProgramGalleryProps = {
  items: GalleryItemData[];
  /** Names the collection for assistive tech, e.g. the programme title. */
  label: string;
  /** How many thumbnails to show before "View all images". */
  previewCount?: number;
  className?: string;
};

/**
 * A programme's gallery: a preview grid that opens into the full-screen
 * browser.
 *
 * The only client component on the programme page — it exists purely to hold
 * "which image is open". Each programme renders its own instance, so galleries
 * are independent by construction.
 */
export function ProgramGallery({ items, label, previewCount = 6, className }: ProgramGalleryProps) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  // Filter here, with the same rule `GalleryGrid` applies, so the index the
  // grid reports always lines up with the array the lightbox pages through.
  const visible = items.filter((item) => item.consentVerified !== false);
  if (visible.length === 0) return null;

  const preview = visible.slice(0, previewCount);
  const hasMore = visible.length > preview.length;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <GalleryGrid items={preview} onSelect={(index) => setOpenAt(index)} />

      <div className="flex justify-center">
        <Button type="button" variant="outline" onClick={() => setOpenAt(0)}>
          {hasMore ? `View all ${visible.length} images` : "View all images"}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>

      <GalleryLightbox
        items={visible}
        openAt={openAt}
        onClose={() => setOpenAt(null)}
        label={label}
      />
    </div>
  );
}
