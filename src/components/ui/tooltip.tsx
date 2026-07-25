"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Wrap the app once (already included in AppProviders) to enable tooltips. */
export const TooltipProvider = TooltipPrimitive.Provider;

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  side?: ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>["side"];
  align?: ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>["align"];
  delayDuration?: number;
  className?: string;
};

/**
 * Accessible tooltip (Radix): keyboard-focusable trigger, Escape to dismiss,
 * pointer + focus activation. The trigger must be a single focusable element
 * (uses `asChild`). Tooltips are supplementary — never put essential-only info
 * here.
 */
export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 200,
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={6}
          collisionPadding={8}
          className={cn(
            "z-[var(--z-tooltip)] max-w-xs animate-fade rounded-lg bg-ink px-3 py-1.5 text-small text-paper shadow-md",
            className,
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-ink" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
