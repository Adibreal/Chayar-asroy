import type { HomepageInput } from "@/validation/content";

/**
 * Slug of the singleton homepage row. It lives here rather than in
 * `page-actions.ts` because a `"use server"` module cannot export a constant.
 */
export const HOME_SLUG = "home";

/**
 * The database row a homepage save writes.
 *
 * Split out of `saveHomePage` for the same reason `buildMetadata` is split out
 * of `generateSiteMetadata`: it is a pure mapping (input in → row out), so the
 * rules that used to be wrong here — which media column each field lands in,
 * and what happens to a field the form does not manage — can be checked without
 * a session, a request or a database.
 *
 * It also cannot live in `page-actions.ts`: a `"use server"` module may export
 * only async functions, and a stray sync export voids every export in the file.
 */
export function buildHomePageRow(input: HomepageInput, userId: string) {
  const { metaTitle, metaDescription, heroMediaId, ogMediaId, ...content } = input;

  return {
    slug: HOME_SLUG,
    title: "Homepage",
    // Copy only. Media relationships are columns, so `heroMediaId` is lifted
    // out above rather than swept into the jsonb with the rest.
    content,
    // The picker sends `undefined` when cleared, and the field is always part
    // of this form, so absence means "removed" and must clear the column.
    hero_media_id: heroMediaId ?? null,
    meta_title: metaTitle ?? null,
    meta_description: metaDescription ?? null,
    /*
     * The social-sharing image is NOT edited by the homepage form, so its key
     * never appears in the payload. Writing `og_media_id: ogMediaId ?? null`
     * unconditionally — as this used to — silently cleared the column on every
     * save. Omitting the key entirely leaves whatever is stored intact, which
     * keeps `og_media_id` dedicated to Open Graph.
     */
    ...(ogMediaId === undefined ? {} : { og_media_id: ogMediaId }),
    status: "published" as const,
    updated_by: userId,
  };
}
