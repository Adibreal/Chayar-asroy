"use client";

import type { ComponentPropsWithRef } from "react";

import { disabledStyles, transitionBase } from "@/lib/styles";
import { cn } from "@/lib/utils";

type TextareaProps = ComponentPropsWithRef<"textarea">;

/** Multi-line text input, matching `Input`'s styling. Vertically resizable. */
export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full resize-y rounded-lg border border-input bg-surface px-3.5 py-2.5 text-body text-foreground",
        "placeholder:text-muted-foreground/70",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:outline-none",
        "aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/30",
        transitionBase,
        disabledStyles,
        className,
      )}
      {...props}
    />
  );
}
