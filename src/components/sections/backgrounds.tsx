import type { ComponentPropsWithoutRef } from "react";

import { Decor } from "../brand/decor";
import { Blob } from "../brand/motifs";
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
              only a gentle curve enters the frame — never a clipped circle.
              These are tint fields, not ornament, which is why they are still
              drawn shapes rather than artwork. */}
          <Blob className="absolute -top-[16rem] -right-[14rem] size-[28rem] text-marigold/10 sm:-top-[22rem] sm:-right-[19rem] sm:size-[40rem] lg:-top-[26rem] lg:-right-[22rem] lg:size-[46rem]" />
          <Blob className="absolute -bottom-[18rem] -left-[16rem] size-[26rem] text-forest/5 sm:-bottom-[24rem] sm:-left-[21rem] sm:size-[38rem] lg:-bottom-[28rem] lg:-left-[24rem] lg:size-[44rem]" />

          {/* The richest arrangement, for hero-scale sections: a full spray
              upper-right, a mirrored and rotated one lower-left so the pair
              reads as two different plants, and a spiral holding the gap
              between them. */}
          <Decor
            art="leafSpray"
            sizes="(min-width: 1024px) 18vw, 30vw"
            className="absolute -top-4 right-[3%] hidden w-40 rotate-6 opacity-45 lg:block xl:w-52"
          />
          <Decor
            art="leafSpray"
            sizes="(min-width: 1024px) 14vw, 26vw"
            className="absolute bottom-[8%] left-[2%] hidden w-32 -scale-x-100 -rotate-12 opacity-30 xl:block"
          />
          {/* The bold spiral, large and very faint — a hero can carry one
              statement mark where a smaller section cannot. */}
          <Decor
            art="sunSpiral"
            sizes="(min-width: 1024px) 16vw, 28vw"
            className="absolute right-[8%] bottom-[10%] hidden w-40 opacity-20 lg:block xl:w-48"
          />
        </>
      ) : variant === "blobs" ? (
        <>
          <Blob className="absolute -top-[15rem] -left-[13rem] size-[26rem] text-primary/5 sm:-top-[20rem] sm:-left-[17rem] sm:size-[36rem]" />
          <Blob className="absolute -right-[14rem] -bottom-[17rem] size-[28rem] text-marigold/10 sm:-right-[19rem] sm:-bottom-[23rem] sm:size-[38rem]" />

          {/* The quietest preset: one spray, mirrored, and nothing else. */}
          <Decor
            art="leafSpray"
            sizes="(min-width: 1024px) 14vw, 26vw"
            className="absolute top-8 right-[5%] hidden w-32 -scale-x-100 opacity-35 lg:block"
          />
          <Decor
            art="spiral"
            sizes="8vw"
            className="absolute bottom-12 left-[6%] hidden w-14 -rotate-12 opacity-30 md:block"
          />
        </>
      ) : (
        <>
          {/* `scatter` heads the inner pages. Deliberately the mirror image of
              `garden` — spray low-left, spiral high-right — so a reader moving
              from the homepage to `/programs` meets the same language in a
              different arrangement rather than the same picture twice. */}
          <Decor
            art="leafSpray"
            sizes="(min-width: 1024px) 16vw, 30vw"
            className="absolute -bottom-6 left-[3%] hidden w-36 -scale-x-100 rotate-[8deg] opacity-40 md:block lg:w-44"
          />
          <Decor
            art="spiral"
            sizes="10vw"
            className="absolute top-10 right-[7%] w-12 -scale-x-100 opacity-40 sm:w-16"
          />
          {/* The inner pages get the *reaching* pose, so they have a figure of
              their own without echoing the arms-up one on the homepage. */}
          <Decor
            art="figureReaching"
            sizes="(min-width: 1024px) 14vw, 24vw"
            className="absolute right-[3%] -bottom-4 hidden w-32 opacity-25 xl:block"
          />
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
