"use server";

import { revalidatePath } from "next/cache";

import { requireEditor } from "@/server/auth/session";
import { pagesRepository } from "@/server/repositories";
import { AppError } from "@/server/shared/errors";
import { attempt, type Result } from "@/server/shared/result";
import type { Page } from "@/types/database";
import { homepageSchema } from "@/validation/content";

import { buildHomePageRow, HOME_SLUG } from "./home-page-row";

/** The homepage row, or `null` before it has been created. */
export async function getHomePage(): Promise<Page | null> {
  return pagesRepository.findOptional("slug", HOME_SLUG);
}

/**
 * Save homepage content.
 *
 * Copy lives in `content` (jsonb); SEO and media use the row's own columns.
 * Upserts, so the first save creates the row.
 *
 * **Media relationships are columns, never jsonb.** `heroMediaId` is pulled out
 * of the payload before the rest is spread into `content`, so the picked image
 * lands in `hero_media_id` where PostgREST can embed it — the public site reads
 * it exactly the way it reads a programme's cover.
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

    const row = buildHomePageRow(parsed.data, user.id);

    const existing = await getHomePage();
    const saved = existing
      ? await pagesRepository.update(existing.id, row)
      : await pagesRepository.create(row);

    revalidatePath("/");
    return saved;
  });
}
