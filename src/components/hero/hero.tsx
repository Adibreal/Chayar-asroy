import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { Flower, Spiral, Star } from "../brand/motifs";
import { Cluster } from "../layout/cluster";
import { Media } from "../media/media";
import { Floating } from "../motion/floating";
import { OrganicFrame } from "../brand/organic-frame";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

/** Two-column hero shell: content on one side, media on the other (stacks on mobile). */
export function Hero({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid items-center gap-10 lg:grid-cols-2 lg:gap-16", className)}>
      {children}
    </div>
  );
}

export function HeroContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col items-start gap-6", className)}>{children}</div>;
}

/** Eyebrow pill above the hero headline. */
export function HeroBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Badge variant="accent" size="md" className={cn("gap-1.5", className)}>
      <Sparkles className="size-3.5" aria-hidden />
      {children}
    </Badge>
  );
}

/** Button row for the hero's primary/secondary actions. */
export function HeroActions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Cluster gap="sm" className={cn("pt-2", className)}>
      {children}
    </Cluster>
  );
}

/**
 * Hero media — built around real photography as the hero's focal point.
 *
 * The frame is **4:3 at every breakpoint**, matching the aspect ratio event
 * photographs are actually shot at, so `object-cover` has nothing to crop. That
 * is the whole point: the frame was previously 4:5 on small screens and
 * height-driven on desktop, which discarded 40% and 17% of the picture
 * respectively — measured, not estimated — and a group photo loses its outer
 * subjects first. Anything that reintroduces a height constraint reintroduces
 * the crop.
 *
 * Sizing follows the column width rather than the viewport height, so the image
 * also sits a little lower than it used to: the headline, not the photograph,
 * should be the first thing read.
 *
 * The photograph is **masked into the blob**, so it reads as part of the
 * artwork rather than as a rectangular card pasted onto the page.
 *
 * `pebble` is a deliberate choice with a known cost, not an oversight. It
 * consumes the full length of every edge, so at 4:3 it trims the outer edges of
 * the two outside drawings and both outer hems — a tamer shape that preserved
 * them was built, compared side by side, and rejected on design grounds. Keep
 * the aspect ratio at 4:3 regardless: that is what stops `object-cover` from
 * removing the outer children *before* the mask ever gets to them.
 *
 * The cream hairline is a `border`, not padding, so `overflow-hidden` clips the
 * image to the padding box and the browser derives the inner curve itself
 * (outer radius minus border width). That is what keeps the outline even all
 * the way round an irregular shape — an inset mat cannot follow a blob. The
 * matching `bg-surface-sunken` sits underneath purely so sub-pixel seams along
 * the mask edge show cream rather than the page.
 */
export function HeroMedia({ image, className }: { image?: ImageAsset; className?: string }) {
  return (
    <div className={cn("relative mx-auto w-full max-w-md lg:max-w-none", className)}>
      <Floating className="absolute -top-5 -left-5 z-10 hidden sm:block">
        <Star className="size-8 text-marigold" />
      </Floating>
      <Floating className="absolute -right-5 bottom-16 z-10 hidden sm:block" delay={0.8}>
        <Spiral className="size-10 text-secondary" />
      </Floating>
      <Floating className="absolute -bottom-4 left-10 z-10 hidden sm:block" delay={1.4}>
        <Flower className="size-7 text-terracotta" />
      </Floating>
      <OrganicFrame
        shape="pebble"
        className="aspect-[4/3] w-full border-4 border-surface-sunken bg-surface-sunken shadow-md"
      >
        <Media
          image={image}
          sizes="(min-width: 1024px) 46vw, (min-width: 640px) 28rem, 92vw"
          priority
        />
      </OrganicFrame>
    </div>
  );
}

type Stat = { value: ReactNode; label: string };

/** Compact statistics row for the hero. */
export function HeroStats({ stats, className }: { stats: Stat[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-3 gap-4 pt-4", className)}>
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col">
          <dt className="order-2 text-small text-muted-foreground">{stat.label}</dt>
          <dd className="order-1 font-display text-h3 leading-none font-semibold text-primary">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
