"use client";

import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";

import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "w-[min(24rem,92vw)]",
  md: "w-[min(32rem,92vw)]",
  lg: "w-[min(48rem,94vw)]",
} as const;

/**
 * One overlay component with two presentations:
 *  - `modal`  — centred dialog, for short focused tasks
 *  - `drawer` — right-hand slide-over, for editing alongside a list
 *
 * They share Radix `Dialog` (focus trap, Escape, scroll lock) and one API, so
 * a screen can switch presentation without changing its content.
 */
export function Panel({
  trigger,
  title,
  description,
  variant = "modal",
  size = "md",
  footer,
  open,
  onOpenChange,
  children,
}: {
  trigger?: ReactNode;
  title: string;
  description?: string;
  variant?: "modal" | "drawer";
  size?: keyof typeof sizes;
  footer?: ReactNode;
  /** Omit both to let the trigger manage state; pass to control it. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  const isDrawer = variant === "drawer";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal)] animate-fade bg-overlay" />
        <Dialog.Content
          // Radix warns when no description exists; opt out explicitly instead.
          aria-describedby={description ? undefined : ""}
          className={cn(
            "fixed z-[var(--z-modal)] flex flex-col border-border bg-card shadow-xl focus:outline-none",
            isDrawer
              ? "inset-y-0 right-0 w-[min(32rem,94vw)] animate-slide-in-right border-l"
              : cn(
                  "top-1/2 left-1/2 max-h-[90vh] -translate-x-1/2 -translate-y-1/2 animate-fade rounded-xl border",
                  sizes[size],
                ),
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border p-5">
            <div className="min-w-0">
              <Dialog.Title className="text-h5 font-semibold text-foreground">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-1 text-small text-muted-foreground">
                  {description}
                </Dialog.Description>
              ) : null}
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className={cn(
                  "inline-grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground",
                  focusRing,
                )}
              >
                <X className="size-4" aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>

          {footer ? (
            <div className="flex justify-end gap-2 border-t border-border p-4">{footer}</div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
