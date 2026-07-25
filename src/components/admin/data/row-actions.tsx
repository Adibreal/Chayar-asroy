"use client";

import { MoreHorizontal } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import type { ReactNode } from "react";

import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

/**
 * Per-row action menu (Radix `DropdownMenu` — keyboard and screen-reader
 * complete). Collapsing actions into one menu keeps rows calm and scannable,
 * and gives a comfortable touch target on mobile.
 *
 * Compose with `RowAction` / `RowActionSeparator` below.
 */
export function RowActions({
  label = "Row actions",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "inline-grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground",
            focusRing,
          )}
        >
          <MoreHorizontal className="size-4" aria-hidden />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="z-[var(--z-dropdown)] min-w-44 animate-fade rounded-xl border border-border bg-card p-1.5 shadow-lg"
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function RowAction({
  onSelect,
  icon,
  destructive,
  disabled,
  children,
}: {
  onSelect?: () => void;
  icon?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <DropdownMenu.Item
      disabled={disabled}
      onSelect={onSelect}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-lg px-2.5 py-2 text-small outline-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        destructive
          ? "text-danger data-[highlighted]:bg-danger-soft"
          : "data-[highlighted]:bg-surface-hover",
      )}
    >
      {icon}
      {children}
    </DropdownMenu.Item>
  );
}

export function RowActionSeparator() {
  return <DropdownMenu.Separator className="my-1 h-px bg-border" />;
}
