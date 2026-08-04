import type { ReactNode } from "react";

import { Blob, Spiral, Star } from "../brand/motifs";
import { Cluster } from "../layout/cluster";
import { Media } from "../media/media";
import { DecorativeLayer } from "../sections/backgrounds";
import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

type CTASectionProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /**
   * Background photograph from the CMS. Heavily blurred beneath a dark wash, so
   * it sets a mood rather than competing with the message. When absent, `Media`
   * renders the brand placeholder — which blurs into a warm abstract field, so
   * the band is never a flat colour.
   */
  backgroundImage?: ImageAsset | null;
  /** Optional extra content between description and actions (e.g. badges). */
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/**
 * The primary call-to-action band: a blurred photograph under a dark gradient,
 * centered message, decorative motifs. Pass action buttons via `actions` (use
 * high-contrast variants against the dark background).
 */
export function CTASection({
  eyebrow,
  title,
  description,
  backgroundImage,
  children,
  actions,
  className,
}: CTASectionProps) {
  return (
    <div
      className={cn(
        // `bg-primary` is the base beneath the image, not the visible finish —
        // it only shows if the photograph itself fails to load, which keeps the
        // text readable in that case rather than leaving it on bare page.
        "relative isolate overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground sm:px-12 sm:py-20",
        className,
      )}
    >
      {/*
        Background photograph.

        `scale-110` hides the transparent edge that a large blur radius pulls in
        from outside the element. Decorative, so it carries no alt text of its
        own — the band's meaning is entirely in the heading beneath it.
      */}
      <div aria-hidden className="absolute inset-0 -z-20 scale-110 blur-2xl">
        <Media image={backgroundImage ?? undefined} sizes="100vw" className="object-cover" />
      </div>

      {/*
        Readability wash, deepening downward so the actions sit on the darkest
        part of the band.

        Measured rather than eyeballed: an editor may upload a bright
        photograph, and at 60% ink even pure white small text reached only
        4.44:1 against a white image — below the 4.5:1 AA floor. At 70% rising
        to 85% the whole band clears AA against *any* image, which is the point
        of a wash whose job is guaranteeing contrast it cannot predict.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/75 to-ink/85"
      />

      <DecorativeLayer>
        <Blob className="absolute -top-16 -right-16 size-72 text-white/5" />
        <Star className="absolute top-10 left-[8%] size-8 text-marigold/70" />
        <Spiral className="absolute right-[12%] bottom-8 size-10 text-white/15" />
      </DecorativeLayer>

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        {eyebrow ? (
          <Text variant="label" className="text-primary-foreground/90">
            {eyebrow}
          </Text>
        ) : null}
        <Heading level={2} size="h1" className="text-primary-foreground">
          {title}
        </Heading>
        {description ? (
          <Text variant="lead" className="text-primary-foreground/90">
            {description}
          </Text>
        ) : null}
        {children}
        {actions ? (
          <Cluster gap="sm" justify="center" className="pt-2">
            {actions}
          </Cluster>
        ) : null}
      </div>
    </div>
  );
}
