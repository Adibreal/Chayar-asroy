"use client";

import { Switch as SwitchPrimitive } from "radix-ui";
import type { ComponentPropsWithRef } from "react";

import { disabledStyles, focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

type SwitchProps = ComponentPropsWithRef<typeof SwitchPrimitive.Root>;

/** Toggle switch (Radix) for binary on/off settings. */
export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-input transition-colors duration-[var(--duration-fast)] ease-[var(--ease-brand)]",
        "data-[state=checked]:bg-primary",
        focusRing,
        disabledStyles,
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-5 rounded-full bg-white shadow-sm transition-transform duration-[var(--duration-fast)] ease-[var(--ease-brand)] data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
  );
}
