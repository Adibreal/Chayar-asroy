import type { ComponentPropsWithoutRef } from "react";

import { Blob, Branch, Flower, Leaf, Spiral, Star } from "../brand/motifs";
import { cn } from "@/lib/utils";

/**
 * An absolutely-positioned, non-interactive layer for decorative artwork behind
 * a section's content. Always `aria-hidden` and `pointer-events-none`. Place
 * inside a positioned (`relative`/`isolate`) parent.
 */
export function DecorativeLayer({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      {...props}
    />
  );
}

type DecorativeBackgroundProps = {
  /**
   * `garden` is the richest, layered composition (hero-scale sections);
   * `blobs` is a soft tinted wash; `scatter` is light motif punctuation.
   */
  variant?: "blobs" | "scatter" | "garden" | "none";
  className?: string;
};

/**
 * Ready-made decorative background presets composed from brand motifs — the
 * paper-cut visual language of the campaign posters, translated to the web.
 *
 * Deliberately low-contrast and edge-weighted: motifs frame the content rather
 * than sit behind it, and the denser accents only appear once there's room
 * (`sm`/`md`/`lg`), so small screens stay calm.
 */
export function DecorativeBackground({ variant = "blobs", className }: DecorativeBackgroundProps) {
  if (variant === "none") return null;

  return (
    <DecorativeLayer className={className}>
      {variant === "garden" ? (
        <>
          {/* Corner washes. Scaled per breakpoint and pushed far off-canvas so
              only a gentle curve enters the frame — never a clipped circle. */}
          <Blob className="absolute -top-[16rem] -right-[14rem] size-[28rem] text-marigold/10 sm:-top-[22rem] sm:-right-[19rem] sm:size-[40rem] lg:-top-[26rem] lg:-right-[22rem] lg:size-[46rem]" />
          <Blob className="absolute -bottom-[18rem] -left-[16rem] size-[26rem] text-forest/5 sm:-bottom-[24rem] sm:-left-[21rem] sm:size-[38rem] lg:-bottom-[28rem] lg:-left-[24rem] lg:size-[44rem]" />

          {/* Motifs sit comfortably inside the frame, so none reads as cropped. */}
          <Branch className="absolute top-[16%] left-[3%] hidden h-auto w-36 -rotate-12 text-forest/20 xl:block" />
          <Star className="absolute top-[12%] right-[5%] hidden size-5 text-marigold/55 sm:block" />
          <Leaf className="absolute top-[30%] right-[3%] hidden size-7 rotate-12 text-secondary/25 lg:block" />
          <Flower className="absolute bottom-[24%] left-[6%] hidden size-6 text-marigold/35 md:block" />
          <Star className="absolute bottom-[14%] left-[20%] hidden size-4 text-terracotta/40 sm:block" />
          <Spiral className="absolute right-[8%] bottom-[16%] hidden size-8 text-primary/20 lg:block" />
        </>
      ) : variant === "blobs" ? (
        <>
          <Blob className="absolute -top-[15rem] -left-[13rem] size-[26rem] text-primary/5 sm:-top-[20rem] sm:-left-[17rem] sm:size-[36rem]" />
          <Blob className="absolute -right-[14rem] -bottom-[17rem] size-[28rem] text-marigold/10 sm:-right-[19rem] sm:-bottom-[23rem] sm:size-[38rem]" />
          <Branch className="absolute top-10 right-[6%] hidden h-auto w-36 rotate-6 text-forest/15 lg:block" />
          <Flower className="absolute bottom-14 left-[8%] hidden size-6 text-terracotta/25 sm:block" />
        </>
      ) : (
        <>
          <Spiral className="absolute top-12 left-[7%] size-9 text-secondary/35" />
          <Star className="absolute top-20 right-[10%] size-5 text-marigold/55" />
          <Leaf className="absolute top-[44%] left-[4%] hidden size-7 -rotate-12 text-forest/20 md:block" />
          <Spiral className="absolute right-[18%] bottom-16 size-8 text-primary/25" />
          <Star className="absolute bottom-20 left-[14%] size-4 text-highlight/45" />
          <Flower className="absolute right-[6%] bottom-[40%] hidden size-6 text-terracotta/25 md:block" />
        </>
      )}
    </DecorativeLayer>
  );
}

type SectionBackgroundProps = ComponentPropsWithoutRef<"div"> & {
  surface?: "base" | "muted" | "sunken" | "primary";
  decoration?: DecorativeBackgroundProps["variant"];
};

const surfaceClasses = {
  base: "bg-background text-foreground",
  muted: "bg-surface text-foreground",
  sunken: "bg-surface-sunken text-foreground",
  primary: "bg-primary text-primary-foreground",
} as const;

/**
 * A positioned section wrapper that pairs a surface color with an optional
 * decorative layer — the standard backdrop for content sections.
 */
export function SectionBackground({
  surface = "base",
  decoration = "none",
  className,
  children,
  ...props
}: SectionBackgroundProps) {
  return (
    <div
      className={cn("relative isolate overflow-hidden", surfaceClasses[surface], className)}
      {...props}
    >
      <DecorativeBackground variant={decoration} />
      {children}
    </div>
  );
}
