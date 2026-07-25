"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { focusRing, transitionBase } from "@/lib/styles";
import { cn } from "@/lib/utils";

const chip = cva(
  cn(
    "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap",
    transitionBase,
  ),
  {
    variants: {
      size: {
        sm: "h-7 px-3 text-caption",
        md: "h-9 px-4 text-small",
      },
      selected: {
        true: "border-primary bg-primary text-primary-foreground",
        false: "border-border-strong bg-transparent text-foreground hover:bg-surface-hover",
      },
    },
    defaultVariants: { size: "md", selected: false },
  },
);

type ChipProps = Omit<ComponentPropsWithoutRef<"button">, "children"> &
  VariantProps<typeof chip> & {
    children: ReactNode;
    /** When set, renders a remove (×) button; the chip body is not itself a button. */
    onRemove?: () => void;
    removeLabel?: string;
  };

/**
 * Interactive tag. Two modes:
 * - **Toggle/filter** — a `<button>` with `aria-pressed` (pass `selected`).
 * - **Removable** — a static chip with a dedicated remove (×) button
 *   (pass `onRemove`), avoiding invalid nested buttons.
 */
export function Chip({
  size,
  selected,
  className,
  children,
  onRemove,
  removeLabel = "Remove",
  ...rest
}: ChipProps) {
  if (onRemove) {
    return (
      <span className={cn(chip({ size, selected }), "pe-1.5", className)}>
        {children}
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className={cn(
            "-me-1 grid size-6 place-items-center rounded-full transition-colors hover:bg-foreground/10",
            focusRing,
          )}
        >
          <X className="size-4" aria-hidden />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={selected ?? undefined}
      className={cn(chip({ size, selected }), focusRing, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
