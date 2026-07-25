"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

import { disabledStyles, transitionBase } from "@/lib/styles";
import { cn } from "@/lib/utils";

const input = cva(
  cn(
    "flex w-full rounded-lg border border-input bg-surface text-foreground",
    "placeholder:text-muted-foreground/70",
    "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:outline-none",
    "aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/30",
    transitionBase,
    disabledStyles,
  ),
  {
    variants: {
      inputSize: {
        sm: "h-9 px-3 text-small",
        md: "h-11 px-3.5 text-body",
        lg: "h-13 px-4 text-body",
      },
    },
    defaultVariants: { inputSize: "md" },
  },
);

type InputProps = Omit<ComponentPropsWithRef<"input">, "size"> & VariantProps<typeof input>;

/**
 * Text input. Set `aria-invalid` (e.g. via `<Field>`) to surface the error
 * state. `inputSize` avoids clashing with the native numeric `size` attribute.
 */
export function Input({ className, inputSize, type = "text", ...props }: InputProps) {
  return <input type={type} className={cn(input({ inputSize }), className)} {...props} />;
}
