import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getGalleryEventSlugs } from "@/server/content/gallery";
import { getProgramSlugs } from "@/server/content/programs";

/**
 * Regenerated hourly, and immediately after any CMS save (which refreshes the
 * whole site), so a newly published programme is listed without a deploy.
 */
export const revalidate = 3600;

/**
 * Every public page, read from the same content layer the pages render from —
 * so the sitemap lists exactly what is published, never a page that 404s.
 *
 * No `lastModified`: the content layer does not track per-page edit times, and
 * a timestamp that changes on every build tells crawlers nothing true.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programSlugs, gallerySlugs] = await Promise.all([
    getProgramSlugs(),
    getGalleryEventSlugs(),
  ]);

  const page = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly",
  ): MetadataRoute.Sitemap[number] => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency,
    priority,
  });

  return [
    page("", 1, "weekly"),
    page("/programs", 0.8, "weekly"),
    page("/gallery", 0.8, "weekly"),
    ...programSlugs.map((slug) => page(`/programs/${slug}`, 0.7, "monthly")),
    ...gallerySlugs.map((slug) => page(`/gallery/${slug}`, 0.6, "monthly")),
  ];
}
