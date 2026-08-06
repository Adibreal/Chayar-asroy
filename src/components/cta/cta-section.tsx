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
   * Background photograph from the CMS. Softly blurred beneath a warm wash —
   * recognisable as a real moment, but never competing with the message. When
   * absent, `Media` renders the brand placeholder, which blurs into a warm
   * abstract field, so the band is never a flat colour.
   */
  backgroundImage?: ImageAsset | null;
  /** Optional extra content between description and actions (e.g. badges). */
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/**
 * The primary call-to-action band: a softly blurred photograph under a warm
 * wash and a vignette, centered message, decorative motifs. Pass action buttons
 * via `actions` (use high-contrast variants against the dark background).
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
        Background photograph. Decorative, so the layer is `aria-hidden` and the
        image's alt text never reaches assistive tech — the band's meaning is
        entirely in the heading beneath it.

        Blurred only enough to stop it competing with the words — at 8px the
        gathering is still legible as real people in a real room, which is the
        point: this should read as a Chayar Asroy moment, not as texture.
        Saturation and a small warm hue shift push the reds and lamplight
        towards the site's cream-and-gold palette.

        `object-[50%_40%]` is a deliberate crop, not the default centre. The
        band is a 2.45:1 letterbox on desktop and 0.69 portrait on mobile, so it
        takes a narrow slice of a tall photograph either way; 40% is where the
        faces and raised hands sit. Centring instead lands on clothing.

        `scale-110` hides the transparent edge that the blur radius pulls in
        from outside the element.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 scale-110 blur-[8px] hue-rotate-[-4deg] saturate-[1.2]"
      >
        <Media
          image={backgroundImage ?? undefined}
          sizes="100vw"
          className="object-cover object-[50%_40%]"
        />
      </div>

      {/*
        Readability wash: `ink`, the palette's warm charcoal — brown rather than
        neutral grey, so it warms the photograph instead of greying it.
      */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink/55" />

      {/*
        Vignette. Darkens the corners and leaves the middle clearest, so the eye
        settles on the heading rather than wandering the photograph.

        It also buys back the contrast the flat wash gives up — but *not* where
        the text is, since the text sits in the lightest part. So the 55% base
        is what has to hold, and it was measured there: simulating each
        breakpoint's real band geometry with this crop, blur and saturation, the
        worst pixel anywhere inside the centred text block yields **5.11:1**
        (desktop), **5.43:1** (tablet) and **5.56:1** (mobile) for the dimmest
        text in the band — white at 90% — against a 4.5:1 AA floor.

        **All three settings are coupled and image-dependent.** Blur, wash and
        photograph trade against each other: less blur sharpens the bright spots
        the wash has to cover, and a brighter photograph needs more wash. At
        these settings only four of the library's nineteen images clear AA at
        all — several otherwise-lovely ones land at 3.3–3.5. So do not swap the
        campaign image without re-measuring; a picture that looks fine
        unblurred can quietly put the eyebrow text below the floor.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-radial from-transparent from-40% to-ink/30"
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
