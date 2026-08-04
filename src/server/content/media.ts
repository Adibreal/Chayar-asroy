import "server-only";

import type { createPublicClient } from "@/lib/supabase/public";
import type { ImageAsset } from "@/types";

/**
 * Shared media mapping for the public content layer.
 *
 * Every public query embeds its image the same way
 * (`media:some_media_id(bucket_id, storage_path, alt_text)`), so the row → URL
 * → `ImageAsset` conversion lives here once rather than in each query module.
 */

export type PublicClient = NonNullable<ReturnType<typeof createPublicClient>>;

/** The shape every `media:` embed in this layer selects. */
export type JoinedMedia = {
  bucket_id: string;
  storage_path: string;
  alt_text: string;
} | null;

/** Public URL for a joined media row. Synchronous — no extra round-trip. */
export function mediaUrl(supabase: PublicClient, media: JoinedMedia): string | null {
  if (!media) return null;
  return supabase.storage.from(media.bucket_id).getPublicUrl(media.storage_path).data.publicUrl;
}

/**
 * A joined media row as the `ImageAsset` the design system components accept.
 *
 * `fallbackAlt` covers images stored before alt text became required in the
 * media library. It is opt-in per caller rather than a default here, because a
 * generic description is worse than none for a decorative image and better than
 * none for a content one — only the caller knows which it has.
 */
export function toImageAsset(
  supabase: PublicClient,
  media: JoinedMedia,
  fallbackAlt?: string | null,
): ImageAsset | null {
  const src = mediaUrl(supabase, media);
  if (!src || !media) return null;
  return { src, alt: media.alt_text.trim() || (fallbackAlt ?? "") };
}
