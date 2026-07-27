"use client";

import { Menu, X } from "lucide-react";
import { Dialog, VisuallyHidden } from "radix-ui";
import { useState } from "react";

import { Logo } from "../brand/logo";
import { PrimaryCta } from "../cta/primary-cta";
import type { SiteContent } from "@/server/content/site";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

import { NavLinks } from "./nav-links";
import { SocialLinks, toSocialLinks } from "./social-links";

/**
 * Mobile navigation drawer (Radix Dialog) — focus-trapped, Escape-dismissable,
 * with an accessible (visually-hidden) title. Trigger is hidden on `lg`+.
 */
export function MobileNav({ site }: { site: SiteContent }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className={cn(
            "inline-grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-hover lg:hidden",
            focusRing,
          )}
        >
          <Menu className="size-6" aria-hidden />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal)] animate-fade bg-overlay backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-[var(--z-modal)] flex w-[min(20rem,85vw)] animate-slide-in-right flex-col gap-8 bg-background p-6 shadow-xl focus:outline-none"
        >
          <div className="flex items-center justify-between">
            <Logo name={site.name} nameBn={site.nameBn} />
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className={cn(
                  "inline-grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-hover",
                  focusRing,
                )}
              >
                <X className="size-5" aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <VisuallyHidden.Root>
            <Dialog.Title>Navigation menu</Dialog.Title>
          </VisuallyHidden.Root>

          {/* NavLinks renders null while no routes are available, so the
              drawer shows just the brand, primary action and socials. */}
          <nav aria-label="Mobile">
            <NavLinks
              items={site.nav}
              orientation="vertical"
              onNavigate={close}
              className="text-h6 [&_a]:py-2.5"
            />
          </nav>

          <div className="mt-auto flex flex-col gap-5">
            <PrimaryCta cta={site.primaryCta} className="w-full" onClick={close} />
            <SocialLinks items={toSocialLinks(site.socials)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
