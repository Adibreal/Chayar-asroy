"use client";

import { Check } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import type { ComponentPropsWithRef } from "react";

import { disabledStyles, focusRing, transitionBase } from "@/lib/styles";
import { cn } from "@/lib/utils";

type CheckboxProps = ComponentPropsWithRef<typeof CheckboxPrimitive.Root>;

/** Checkbox (Radix): keyboard-operable, supports checked/unchecked/indeterminate. */
export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "grid size-5 shrink-0 place-items-center rounded-[0.3rem] border border-input bg-surface text-primary-foreground",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
        focusRing,
        transitionBase,
        disabledStyles,
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="grid place-items-center text-current">
        <Check className="size-3.5" strokeWidth={3} aria-hidden />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
