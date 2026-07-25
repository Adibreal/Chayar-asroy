"use client";

import { AlertTriangle, Check, ImageOff } from "lucide-react";
import Image from "next/image";

import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

/** Human-readable file size for the card footer. */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export type MediaCardItem = {
  id: string;
  url?: string;
  fileName: string;
  altText: string;
  sizeBytes?: number;
  consentVerified?: boolean;
};

/**
 * A single item in the media library or picker.
 *
 * Two safety signals are surfaced right on the card, because they're the two
 * mistakes that matter most here:
 *  - **missing alt text** — would ship an inaccessible image
 *  - **consent not verified** — blocks publishing a child's photo (the
 *    database enforces this; the badge makes it visible before the error)
 */
export function MediaCard({
  item,
  selected = false,
  onSelect,
  className,
}: {
  item: MediaCardItem;
  selected?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const interactive = Boolean(onSelect);
  const needsAlt = !item.altText.trim();

  const content = (
    <>
      <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-surface-sunken">
        {item.url ? (
          <Image
            src={item.url}
            alt={item.altText || ""}
            fill
            sizes="(min-width: 1024px) 20vw, 45vw"
            className="object-cover"
          />
        ) : (
          <span className="grid size-full place-items-center text-muted-foreground">
            <ImageOff className="size-6" aria-hidden />
          </span>
        )}

        {selected ? (
          <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-4" aria-hidden />
          </span>
        ) : null}
      </div>

      <div className="mt-2 min-w-0">
        <p className="truncate text-caption font-medium text-foreground">{item.fileName}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {item.sizeBytes !== undefined ? (
            <span className="text-caption text-muted-foreground">
              {formatBytes(item.sizeBytes)}
            </span>
          ) : null}
          {needsAlt ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-1.5 py-0.5 text-caption text-ink">
              <AlertTriangle className="size-3" aria-hidden />
              No alt text
            </span>
          ) : null}
          {item.consentVerified === false ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-danger-soft px-1.5 py-0.5 text-caption text-danger">
              Consent needed
            </span>
          ) : null}
        </div>
      </div>
    </>
  );

  if (!interactive) {
    return (
      <div className={cn("rounded-xl border border-border bg-card p-2", className)}>{content}</div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(item.id)}
      aria-pressed={selected}
      className={cn(
        "rounded-xl border bg-card p-2 text-left transition-colors",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border hover:bg-surface-hover",
        focusRing,
        className,
      )}
    >
      {content}
    </button>
  );
}
