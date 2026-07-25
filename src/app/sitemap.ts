import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * Sitemap. Currently lists only the homepage; routes are appended as pages are
 * built in later phases (ideally generated from the same route source).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
