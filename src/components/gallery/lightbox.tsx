"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Dialog, VisuallyHidden } from "radix-ui";
import type { ReactNode } from "react";

import { ImagePlaceholder } from "../media/media";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

type LightboxProps = {
  image?: ImageAsset;
  caption?: ReactNode;
  /** Accessible dialog title (defaults to the image alt). */
  title?: string;
  /** The trigger element (e.g. a thumbnail button). */
  children: ReactNode;
};

/**
 * Wraps any trigger so it opens an enlarged image in an accessible modal
 * (focus-trapped, Escape to close, labelled). Falls back to the branded
 * placeholder when no image is provided.
 */
export function Lightbox({ image, caption, title, children }: LightboxProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal)] animate-fade bg-overlay backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-[var(--z-modal)] flex w-[min(92vw,72rem)] -translate-x-1/2 -translate-y-1/2 animate-fade flex-col gap-3 focus:outline-none"
        >
          <VisuallyHidden.Root>
            <Dialog.Title>{title ?? image?.alt ?? "Image preview"}</Dialog.Title>
          </VisuallyHidden.Root>

          <div className="relative overflow-hidden rounded-2xl bg-surface-sunken shadow-xl">
            {image ? (
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width ?? 1600}
                height={image.height ?? 1067}
                sizes="92vw"
                className="mx-auto h-auto max-h-[80vh] w-auto object-contain"
              />
            ) : (
              <ImagePlaceholder className="aspect-video" />
            )}

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className={cn(
                  "absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-surface-hover",
                  focusRing,
                )}
              >
                <X className="size-5" aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          {caption ? <p className="text-center text-small text-paper">{caption}</p> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
