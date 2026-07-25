"use client";

import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type { ComponentPropsWithRef } from "react";

import { disabledStyles, focusRing, transitionBase } from "@/lib/styles";
import { cn } from "@/lib/utils";

/** Radio group container (Radix): arrow-key navigation, single selection. */
export function RadioGroup({
  className,
  ...props
}: ComponentPropsWithRef<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2.5", className)} {...props} />;
}

export function RadioGroupItem({
  className,
  ...props
}: ComponentPropsWithRef<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "size-5 shrink-0 rounded-full border border-input bg-surface",
        "data-[state=checked]:border-primary",
        focusRing,
        transitionBase,
        disabledStyles,
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="grid size-full place-items-center after:size-2.5 after:rounded-full after:bg-primary after:content-['']" />
    </RadioGroupPrimitive.Item>
  );
}
