import { cn } from "@/lib/utils";

import { GalleryItem, type GalleryItemData } from "./gallery-item";

/**
 * Responsive gallery grid. Items with `consentVerified === false` are omitted —
 * a hard gate so no unconsented photo of a child ever renders.
 */
export function GalleryGrid({
  items,
  onSelect,
  className,
}: {
  items: GalleryItemData[];
  /**
   * Receives the index *within the visible items*. When omitted each thumbnail
   * opens its own single-image lightbox, as on the homepage preview.
   */
  onSelect?: (index: number) => void;
  className?: string;
}) {
  const visible = items.filter((item) => item.consentVerified !== false);

  return (
    <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {visible.map((item, index) => (
        <GalleryItem
          key={item.id}
          item={item}
          {...(onSelect ? { onSelect: () => onSelect(index) } : {})}
        />
      ))}
    </div>
  );
}
