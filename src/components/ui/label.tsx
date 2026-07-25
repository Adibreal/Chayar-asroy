"use client";

import { Label as LabelPrimitive } from "radix-ui";
import type { ComponentPropsWithRef } from "react";

import { cn } from "@/lib/utils";

type LabelProps = ComponentPropsWithRef<typeof LabelPrimitive.Root> & {
  /** Appends a required indicator (*). */
  required?: boolean;
};

/**
 * Accessible form label (Radix). Associate with a control via `htmlFor`, or let
 * `<Field>` wire it automatically.
 */
export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "inline-flex items-center gap-0.5 text-small font-medium text-foreground select-none",
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <span className="text-danger" aria-hidden>
          *
        </span>
      ) : null}
    </LabelPrimitive.Root>
  );
}
