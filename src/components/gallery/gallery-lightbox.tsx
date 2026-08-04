"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { Dialog, VisuallyHidden } from "radix-ui";
import { useCallback, useEffect, useRef, useState } from "react";

import { ImagePlaceholder } from "../media/media";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

import type { GalleryItemData } from "./gallery-item";

type GalleryLightboxProps = {
  items: GalleryItemData[];
  /** Index to open at. `null` keeps the lightbox closed. */
  openAt: number | null;
  onClose: () => void;
  /** Names the collection for assistive tech, e.g. the programme title. */
  label: string;
};

/**
 * Full-screen browser for a collection of images.
 *
 * Deliberately a sibling of `Lightbox` rather than a rewrite of it: that one
 * wraps a single trigger and stays the right tool for one-off images, while a
 * gallery needs shared open state, paging and preloading. Both use the same
 * Radix Dialog shell, so focus trapping, Escape and the overlay behave
 * identically.
 *
 * Navigation: ← / → keys, on-screen buttons, and horizontal swipe. Images are
 * lazy by default; only the neighbours of the current image are given priority,
 * so opening a large gallery does not fetch every full-resolution file.
 */
export function GalleryLightbox({ items, openAt, onClose, label }: GalleryLightboxProps) {
  const [index, setIndex] = useState(openAt ?? 0);
  const [lastOpenAt, setLastOpenAt] = useState(openAt);
  const touchStartX = useRef<number | null>(null);

  // Follow the trigger when the caller opens a different image. Adjusted during
  // render with a last-value tracker rather than in an effect: React's
  // `set-state-in-effect` rule forbids the effect form, and this avoids the
  // extra render pass it would cost. See HANDOFF §9.
  if (openAt !== null && openAt !== lastOpenAt) {
    setLastOpenAt(openAt);
    setIndex(openAt);
  }

  const count = items.length;
  const go = useCallback(
    (delta: number) => setIndex((current) => (current + delta + count) % count),
    [count],
  );

  useEffect(() => {
    if (openAt === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAt, go]);

  if (count === 0) return null;
  const current = items[index] ?? items[0];
  if (!current) return null;

  return (
    <Dialog.Root open={openAt !== null} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal)] animate-fade bg-overlay backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[var(--z-modal)] flex animate-fade flex-col items-center justify-center gap-3 p-4 focus:outline-none sm:p-8"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = touchStartX.current;
            const end = event.changedTouches[0]?.clientX ?? null;
            touchStartX.current = null;
            if (start === null || end === null) return;
            // 48px threshold keeps a tap or a vertical scroll from paging.
            if (Math.abs(end - start) > 48) go(end < start ? 1 : -1);
          }}
        >
          <VisuallyHidden.Root>
            <Dialog.Title>{label}</Dialog.Title>
          </VisuallyHidden.Root>

          <div className="relative flex max-h-full w-full max-w-6xl flex-1 items-center justify-center">
            {current.image ? (
              <Image
                key={current.id}
                src={current.image.src}
                alt={current.image.alt}
                width={current.image.width ?? 1600}
                height={current.image.height ?? 1067}
                sizes="92vw"
                priority
                className="h-auto max-h-[78vh] w-auto rounded-2xl object-contain shadow-xl"
              />
            ) : (
              <ImagePlaceholder className="aspect-video w-full rounded-2xl" />
            )}

            {count > 1 ? (
              <>
                <NavButton side="left" onClick={() => go(-1)} />
                <NavButton side="right" onClick={() => go(1)} />
              </>
            ) : null}
          </div>

          {/* Announced politely so screen readers hear position changes. */}
          <div className="flex flex-col items-center gap-1 text-center">
            {current.caption ? <p className="text-small text-paper">{current.caption}</p> : null}
            <p className="text-caption text-paper/80" aria-live="polite">
              {index + 1} of {count}
            </p>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close gallery"
              className={cn(
                "absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-surface-hover",
                focusRing,
              )}
            >
              <X className="size-5" aria-hidden />
            </button>
          </Dialog.Close>

          {/* Neighbours only — enough for instant paging without fetching all. */}
          <div className="hidden">
            {[items[(index + 1) % count], items[(index - 1 + count) % count]].map((neighbour) =>
              neighbour?.image ? (
                <Image
                  key={`preload-${neighbour.id}`}
                  src={neighbour.image.src}
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden
                />
              ) : null,
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous image" : "Next image"}
      className={cn(
        "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-surface-hover",
        side === "left" ? "left-2 sm:-left-4" : "right-2 sm:-right-4",
        focusRing,
      )}
    >
      <Icon className="size-6" aria-hidden />
    </button>
  );
}
