import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Resolve a media id to its public URL.
 *
 * Every editor that shows an existing image needs this, and each had its own
 * copy of the same query + `getPublicUrl` call. One helper keeps the storage
 * details in a single place.
 *
 * Returns `null` for a missing id or a deleted row, so callers can render a
 * placeholder rather than a broken image.
 */
export async function getMediaUrl(mediaId: string | null | undefined): Promise<string | null> {
  if (!mediaId) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("media")
    .select("bucket_id, storage_path")
    .eq("id", mediaId)
    .maybeSingle();

  if (!data) return null;
  return supabase.storage.from(data.bucket_id).getPublicUrl(data.storage_path).data.publicUrl;
}
