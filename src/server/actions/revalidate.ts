import "server-only";

import { revalidatePath } from "next/cache";

/**
 * Refresh every page of the public site after a CMS change.
 *
 * Deliberately the whole site rather than a hand-picked list of paths. A list
 * goes stale silently: `revalidatePath("/programs")` refreshes that one page
 * and *not* the prerendered `/programs/[slug]` pages beneath it, so edits to a
 * programme — and, worse, unpublishing a child's photograph — never reached
 * the pages that showed them. Content is shared across pages (a programme
 * appears on its own page, its gallery page, the archive, the homepage and the
 * sitemap), so "refresh everything" is the only rule that cannot miss one.
 *
 * It is cheap here: the public site is a handful of static pages, regenerated
 * lazily on their next visit, and CMS saves are rare.
 */
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
}
