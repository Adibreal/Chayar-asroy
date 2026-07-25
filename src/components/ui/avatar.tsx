"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Avatar as AvatarPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const avatar = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-surface-sunken font-medium text-muted-foreground select-none",
  {
    variants: {
      size: {
        xs: "size-6 text-caption",
        sm: "size-8 text-small",
        md: "size-10 text-body",
        lg: "size-12 text-body",
        xl: "size-16 text-h5",
      },
      shape: {
        circle: "rounded-full",
        rounded: "rounded-xl",
      },
    },
    defaultVariants: { size: "md", shape: "circle" },
  },
);

type AvatarProps = VariantProps<typeof avatar> & {
  src?: string;
  /** Required: describes the person for assistive tech. */
  alt: string;
  /** Fallback content (defaults to initials derived from `alt`). */
  fallback?: string;
  className?: string;
};

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/**
 * User/person avatar with graceful image-load fallback to initials (via Radix).
 */
export function Avatar({ src, alt, fallback, size, shape, className }: AvatarProps) {
  return (
    <AvatarPrimitive.Root className={cn(avatar({ size, shape }), className)}>
      {src ? (
        <AvatarPrimitive.Image src={src} alt={alt} className="size-full object-cover" />
      ) : null}
      <AvatarPrimitive.Fallback
        delayMs={src ? 400 : 0}
        className="grid size-full place-items-center"
      >
        {fallback ?? initialsFrom(alt)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
