import "server-only";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin, requireEditor } from "@/server/auth/session";
import { errors } from "@/server/shared/errors";
import type { Media } from "@/types/database";
import { type MediaFolder, uploadFileSchema } from "@/validation/media";

/** Public bucket for everything the website renders. */
export const MEDIA_BUCKET = "media";
/** Private bucket for internal files (consent forms, reports). */
export const DOCUMENTS_BUCKET = "documents";

/**
 * Build the canonical storage path: `<folder>/<yyyy>/<mm>/<uuid>.<ext>`.
 *
 * Date-partitioned so a folder never accumulates thousands of files, and
 * UUID-named so uploads can never collide or leak the original filename.
 */
function buildStoragePath(folder: MediaFolder, fileName: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "bin";
  return `${folder}/${year}/${month}/${crypto.randomUUID()}.${extension}`;
}

/**
 * Upload an image and register it in the media library.
 *
 * The single entry point for adding media — every uploader (hero, gallery,
 * programs, stories) calls this, so validation, pathing and bookkeeping are
 * never reimplemented.
 *
 * Storage and the database are two systems: if the row insert fails, the
 * orphaned object is removed so the two cannot drift apart.
 */
export async function uploadMedia(input: unknown): Promise<Media> {
  const user = await requireEditor();

  const parsed = uploadFileSchema.safeParse(input);
  if (!parsed.success) {
    throw errors.validation(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { file, folder, altText, caption } = parsed.data;
  const supabase = await createClient();
  const storagePath = buildStoragePath(folder, file.name);

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    throw errors.storage("The file could not be uploaded.", uploadError);
  }

  const { data, error } = await supabase
    .from("media")
    .insert({
      bucket_id: MEDIA_BUCKET,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      alt_text: altText,
      caption,
      uploaded_by: user.id,
    })
    .select("*")
    .single();

  if (error || !data) {
    // Roll back the object so storage never holds an unreferenced file.
    await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);
    throw errors.storage("The upload could not be saved.", error);
  }

  return data;
}

/**
 * Delete media from both storage and the library (admin only).
 *
 * The database row is removed first: if that fails, the file is still
 * reachable and nothing is broken. Deleting the file first could leave a row
 * pointing at a missing object.
 */
export async function deleteMedia(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: media } = await supabase
    .from("media")
    .select("bucket_id, storage_path")
    .eq("id", id)
    .single();

  if (!media) throw errors.notFound("That file could not be found.");

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) throw errors.storage("The file could not be removed.", error);

  await supabase.storage.from(media.bucket_id).remove([media.storage_path]);
}

/** Public CDN URL for a stored object. */
export async function getPublicUrl(bucketId: string, storagePath: string): Promise<string> {
  const supabase = await createClient();
  return supabase.storage.from(bucketId).getPublicUrl(storagePath).data.publicUrl;
}

/** Time-limited URL for a private object (documents bucket). */
export async function getSignedUrl(
  bucketId: string,
  storagePath: string,
  expiresInSeconds = 60 * 10,
): Promise<string> {
  await requireEditor();
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(bucketId)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error || !data) throw errors.storage("That file link could not be created.", error);
  return data.signedUrl;
}
