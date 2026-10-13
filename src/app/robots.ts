import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // The CMS is already `noindex`; disallowing it as well stops crawlers
    // spending requests on a login screen.
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
