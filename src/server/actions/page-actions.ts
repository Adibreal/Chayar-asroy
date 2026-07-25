"use server";

import { revalidatePath } from "next/cache";

import { requireEditor } from "@/server/auth/session";
import { pagesRepository } from "@/server/repositories";
import { AppError } from "@/server/shared/errors";
import { attempt, type Result } from "@/server/shared/result";
import type { Page } from "@/types/database";
import { homepageSchema } from "@/validation/content";

/**
 * Slug of the singleton homepage row.
 *
 * Deliberately NOT exported: every export of a `"use server"` module must be an
 * async function, and a stray `const` export silently voids the whole module.
 */
const HOME_SLUG = "home";

/** The homepage row, or `null` before it has been created. */
export async function getHomePage(): Promise<Page | null> {
  return pagesRepository.findOptional("slug", HOME_SLUG);
}

/**
 * Save homepage content.
 *
 * Hero and mission copy live in `content` (jsonb); SEO uses the row's own
 * columns. Upserts, so the first save creates the row.
 */
export async function saveHomePage(input: unknown): Promise<Result<Page>> {
  return attempt(async () => {
    const user = await requireEditor();

    const parsed = homepageSchema.safeParse(input);
    if (!parsed.success) {
      throw new AppError("VALIDATION", "Please check the highlighted fields.", {
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      });
    }

    const { metaTitle, metaDescription, ogMediaId, ...content } = parsed.data;

    const row = {
      slug: HOME_SLUG,
      title: "Homepage",
      content,
      meta_title: metaTitle ?? null,
      meta_description: metaDescription ?? null,
      og_media_id: ogMediaId ?? null,
      status: "published" as const,
      updated_by: user.id,
    };

    const existing = await getHomePage();
    const saved = existing
      ? await pagesRepository.update(existing.id, row)
      : await pagesRepository.create(row);

    revalidatePath("/");
    return saved;
  });
}
