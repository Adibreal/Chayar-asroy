import { cn } from "@/lib/utils";

import { GalleryItem, type GalleryItemData } from "./gallery-item";

/**
 * Responsive gallery grid. Items with `consentVerified === false` are omitted —
 * a hard gate so no unconsented photo of a child ever renders.
 */
export function GalleryGrid({
  items,
  className,
}: {
  items: GalleryItemData[];
  className?: string;
}) {
  const visible = items.filter((item) => item.consentVerified !== false);

  return (
    <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {visible.map((item) => (
        <GalleryItem key={item.id} item={item} />
      ))}
    </div>
  );
}
