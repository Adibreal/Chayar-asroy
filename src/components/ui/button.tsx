"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentPropsWithoutRef, Ref } from "react";

import { disabledStyles, focusRing, transitionBase } from "@/lib/styles";
import { cn } from "@/lib/utils";

import { Spinner } from "./spinner";

const button = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none",
    focusRing,
    transitionBase,
    disabledStyles,
    "active:scale-[0.98]",
  ),
  {
    // `size` first so a variant's padding override (e.g. `text`) wins.
    variants: {
      size: {
        sm: "h-9 px-4 text-small",
        md: "h-11 px-5 text-body",
        lg: "h-13 px-7 text-body",
        icon: "size-11",
      },
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover active:bg-primary-active",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary-hover active:bg-secondary-active",
        accent:
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover active:brightness-95",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:bg-surface-hover",
        ghost: "bg-transparent text-primary hover:bg-primary-soft",
        text: "bg-transparent px-0 text-primary underline-offset-4 hover:underline active:scale-100",
        destructive: "bg-danger text-danger-foreground shadow-sm hover:bg-danger/90",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = Omit<ComponentPropsWithoutRef<"button">, "color"> &
  VariantProps<typeof button> & {
    /** Merge props onto the child element instead of rendering a `<button>`. */
    asChild?: boolean;
    /** Shows a spinner, sets `aria-busy`, and disables the button. */
    loading?: boolean;
    ref?: Ref<HTMLButtonElement>;
  };

/**
 * The primary action element. Six variants × four sizes, with loading and
 * `asChild` (render as a link etc.) support. Keyboard-focusable with a
 * consistent ring; disabled/loading states are non-interactive.
 */
export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  type,
  children,
  ref,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const isDisabled = disabled ?? loading;

  return (
    <Comp
      ref={ref}
      className={cn(button({ variant, size }), className)}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      {...(asChild ? {} : { type: type ?? "button", disabled: isDisabled })}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && <Spinner size={size === "sm" ? "sm" : "md"} className="-ms-0.5" />}
          {children}
        </>
      )}
    </Comp>
  );
}

export { button as buttonVariants };
