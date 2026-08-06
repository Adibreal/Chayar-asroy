import Image from "next/image";

import figure from "@/assets/decor/figure.webp";
import leafSpray from "@/assets/decor/leaf-spray.webp";
import spiral from "@/assets/decor/spiral.webp";
import { cn } from "@/lib/utils";

/**
 * The official decorative artwork — the site's primary ornamental language.
 *
 * These are the supplied brand assets, cut out of the two design sheets and
 * re-encoded (WebP, ~150 KB for the set, down from 3.9 MB of source PNG). They
 * replace the drawn SVG motifs for page decoration; those remain in `motifs.tsx`
 * only for the large off-canvas colour washes, which are tint fields rather
 * than ornament.
 *
 * Variety comes from *transforming* these three, never from adding new artwork:
 * scale, rotation, mirroring (`-scale-x-100`) and opacity. That is what keeps
 * every page related without any two looking alike.
 *
 * Always decorative: `alt=""` plus `aria-hidden`, so nothing here reaches the
 * accessibility tree. Place inside a `DecorativeLayer`, which handles the
 * positioning context and `pointer-events-none`.
 */
const artwork = {
  /** The figure with brush and tool. The only asset depicting a person — spend it sparingly. */
  figure,
  /** Five leaves on a curving stem. The workhorse: reads at any size. */
  leafSpray,
  /** Open spiral with a trailing tail. Best small, as punctuation. */
  spiral,
} as const;

export type DecorArt = keyof typeof artwork;

export function Decor({
  art,
  className,
  sizes = "(min-width: 1024px) 20vw, 40vw",
}: {
  art: DecorArt;
  /** Position, size, rotation, mirroring and opacity all live here. */
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={artwork[art]}
      alt=""
      aria-hidden
      sizes={sizes}
      className={cn("pointer-events-none h-auto select-none", className)}
    />
  );
}
