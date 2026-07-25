"use client";

import { Menu, X } from "lucide-react";
import { Dialog, VisuallyHidden } from "radix-ui";
import { useState } from "react";

import { TreeMark } from "@/components/brand/logo";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/database";

import { SidebarNav } from "./sidebar-nav";

/**
 * Mobile CMS navigation — the same `SidebarNav` in a focus-trapped drawer.
 * Closes automatically on navigation. Hidden at `lg`+ where the sidebar is
 * always visible.
 */
export function MobileSidebar({ role }: { role: UserRole }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className={cn(
            "inline-grid size-10 place-items-center rounded-lg text-foreground transition-colors hover:bg-surface-hover lg:hidden",
            focusRing,
          )}
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal)] animate-fade bg-overlay lg:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-[var(--z-modal)] flex w-[min(17rem,85vw)] animate-slide-in-right flex-col gap-6 border-r border-border bg-surface p-4 focus:outline-none lg:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TreeMark className="size-7" />
              <span className="text-small font-semibold">Chayar Asroy CMS</span>
            </span>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className={cn(
                  "inline-grid size-9 place-items-center rounded-lg transition-colors hover:bg-surface-hover",
                  focusRing,
                )}
              >
                <X className="size-5" aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <VisuallyHidden.Root>
            <Dialog.Title>CMS navigation</Dialog.Title>
          </VisuallyHidden.Root>

          <div className="overflow-y-auto">
            <SidebarNav role={role} onNavigate={() => setOpen(false)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
