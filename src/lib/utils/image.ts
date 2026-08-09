import type { ImageAsset } from "@/types";

/**
 * Where a photograph should sit inside a **wide** crop box.
 *
 * A landscape photo cropped to 16:10 keeps most of its height, so centring is
 * right. A *portrait* photo cropped to the same box keeps roughly a third of
 * its height — and centring lands on torsos, because people photograph faces
 * above the middle. The programme card's Rongjatra cover was the case that
 * showed it: three girls painting, and the default crop cut every face off.
 *
 * So: bias portrait sources upward, leave everything else alone. 25% was chosen
 * by rendering the real covers at 50/35/25/15% and comparing.
 *
 * Returns "" when the dimensions are unknown, which keeps the browser default
 * (centre) — the same behaviour as before this existed.
 */
export function coverPositionClass(image: ImageAsset | undefined): string {
  if (!image?.width || !image?.height) return "";
  return image.height > image.width ? "object-[50%_25%]" : "";
}
