"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/server/auth/session";
import { toRowPayload } from "@/server/actions/entity-actions";
import { siteSettingsRepository } from "@/server/repositories";
import { AppError } from "@/server/shared/errors";
import { attempt, type Result } from "@/server/shared/result";
import type { SiteSettings } from "@/types/database";
import { siteSettingsSchema } from "@/validation/content";

/**
 * Site settings — a singleton row, so this upserts rather than exposing CRUD.
 *
 * Admin-only: these values affect every page of the public website.
 */

/** Read the settings row, or `null` before it has been seeded. */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const result = await siteSettingsRepository.list({ pageSize: 1 });
  return result.rows[0] ?? null;
}

export async function saveSiteSettings(input: unknown): Promise<Result<SiteSettings>> {
  return attempt(async () => {
    const user = await requireAdmin();

    const parsed = siteSettingsSchema.safeParse(input);
    if (!parsed.success) {
      throw new AppError("VALIDATION", "Please check the highlighted fields.", {
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      });
    }

    const row = { ...toRowPayload(parsed.data), updated_by: user.id };
    const existing = await getSiteSettings();

    const saved = existing
      ? await siteSettingsRepository.update(existing.id, row as never)
      : await siteSettingsRepository.create(row as never);

    // Settings touch the whole site.
    revalidatePath("/", "layout");
    return saved;
  });
}

/*
 * Social links are seeded in `supabase/seed.sql` and edited there for now.
 * Actions for them were removed rather than left unused: they had no UI, and
 * dead server actions are a liability. Add them back alongside a real editor.
 */
