"use server";

import { createEntityActions } from "@/server/actions/entity-actions";
import { createClient } from "@/lib/supabase/server";
import { requireEditor } from "@/server/auth/session";
import { attempt, type Result } from "@/server/shared/result";
import type { GalleryItem } from "@/types/database";
import { galleryItemSchema, galleryItemUpdateSchema } from "@/validation/content";

const actions = createEntityActions({
  table: "gallery_items",
  createSchema: galleryItemSchema,
  updateSchema: galleryItemUpdateSchema,
  // `/programs` covers the programme detail pages too: an image attached to a
  // programme changes that programme's gallery, and layout-level revalidation
  // refreshes the prerendered `[slug]` routes beneath it.
  revalidate: ["/admin/gallery", "/gallery", "/programs", "/"],
});

export async function createGalleryItem(input: unknown) {
  return actions.create(input);
}

export async function updateGalleryItem(input: unknown) {
  return actions.update(input);
}

export async function deleteGalleryItem(id: string) {
  return actions.remove(id);
}

/** Persist a new display order (numeric ordering; drag-and-drop is deferred). */
export async function reorderGalleryItems(ids: string[]) {
  return actions.reorder(ids);
}

export type GalleryItemWithMedia = GalleryItem & {
  url: string;
  fileName: string;
  altText: string;
  consentVerified: boolean;
};

/**
 * Gallery items joined to their media, with public URLs resolved.
 *
 * A dedicated query rather than the generic `list()` because the grid needs
 * the image and its consent state in one round-trip.
 */
export async function listGalleryItems(): Promise<Result<GalleryItemWithMedia[]>> {
  return attempt(async () => {
    await requireEditor();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("gallery_items")
      .select("*, media:media_id(bucket_id, storage_path, file_name, alt_text, consent_verified)")
      .order("order_index", { ascending: true });

    if (error) throw error;

    type Joined = GalleryItem & {
      media: {
        bucket_id: string;
        storage_path: string;
        file_name: string;
        alt_text: string;
        consent_verified: boolean;
      } | null;
    };

    return ((data ?? []) as unknown as Joined[]).map((row) => {
      const { media, ...item } = row;
      return {
        ...item,
        url: media
          ? supabase.storage.from(media.bucket_id).getPublicUrl(media.storage_path).data.publicUrl
          : "",
        fileName: media?.file_name ?? "Missing image",
        altText: media?.alt_text ?? "",
        consentVerified: media?.consent_verified ?? false,
      };
    });
  });
}
