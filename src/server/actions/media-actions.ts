"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireEditor } from "@/server/auth/session";
import { mediaRepository } from "@/server/repositories";
import { deleteMedia, uploadMedia } from "@/server/storage/media";
import { AppError } from "@/server/shared/errors";
import { attempt, type Result } from "@/server/shared/result";
import type { Media } from "@/types/database";
import { updateMediaSchema } from "@/validation/media";

/**
 * Media Server Actions.
 *
 * Thin wrappers over the Phase 5A storage layer — upload/delete logic is not
 * reimplemented here, only exposed to the client with `Result` semantics.
 */

export type MediaWithUrl = Media & { url: string };

/** Attach public URLs so the UI never builds storage paths itself. */
async function withUrls(rows: Media[]): Promise<MediaWithUrl[]> {
  const supabase = await createClient();
  return rows.map((row) => ({
    ...row,
    url: supabase.storage.from(row.bucket_id).getPublicUrl(row.storage_path).data.publicUrl,
  }));
}

/** Paginated media for the library and the picker. */
export async function listMedia(params: {
  page?: number;
  search?: string;
}): Promise<Result<{ items: MediaWithUrl[]; total: number; page: number; pageCount: number }>> {
  return attempt(async () => {
    await requireEditor();

    const page = params.page ?? 1;
    const result = await mediaRepository.list({
      page,
      pageSize: 24,
      orderBy: "created_at",
      ascending: false,
      ...(params.search
        ? { search: { term: params.search, columns: ["file_name", "alt_text", "caption"] } }
        : {}),
    });

    return {
      items: await withUrls(result.rows),
      total: result.total,
      page: result.page,
      pageCount: result.pageCount,
    };
  });
}

/** Upload one file. `FormData` so the browser streams it rather than base64. */
export async function uploadMediaAction(formData: FormData): Promise<Result<MediaWithUrl>> {
  return attempt(async () => {
    const file = formData.get("file");
    if (!(file instanceof File)) throw new AppError("VALIDATION", "Choose a file to upload.");

    const media = await uploadMedia({
      file,
      folder: (formData.get("folder") as string) || "general",
      altText: (formData.get("altText") as string) || "",
      caption: (formData.get("caption") as string) || undefined,
    });

    revalidatePath("/admin/media");
    const [withUrl] = await withUrls([media]);
    if (!withUrl) throw new AppError("STORAGE", "The upload could not be read back.");
    return withUrl;
  });
}

/** Update alt text, caption and consent. */
export async function updateMediaAction(input: unknown): Promise<Result<Media>> {
  return attempt(async () => {
    await requireEditor();

    const parsed = updateMediaSchema.safeParse(input);
    if (!parsed.success) {
      throw new AppError("VALIDATION", "Please check the highlighted fields.", {
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      });
    }

    const { id, altText, caption, consentVerified } = parsed.data;
    const row = await mediaRepository.update(id, {
      alt_text: altText,
      caption: caption ?? null,
      consent_verified: consentVerified,
    });

    revalidatePath("/admin/media");
    return row;
  });
}

/** Delete a file from storage and the library (admin only — enforced inside). */
export async function deleteMediaAction(id: string): Promise<Result<{ id: string }>> {
  return attempt(async () => {
    await deleteMedia(id);
    revalidatePath("/admin/media");
    return { id };
  });
}
