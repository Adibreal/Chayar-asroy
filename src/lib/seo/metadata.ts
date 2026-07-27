import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { getSiteContent, type SiteContent } from "@/server/content/site";

/**
 * Page metadata built from CMS site settings.
 *
 * `buildMetadata` stays a pure mapping (content in → `Metadata` out) so it is
 * trivially testable; `generateSiteMetadata` is the async wrapper pages call
 * from `generateMetadata()`. Keeping them separate is what stops the fetch from
 * being duplicated per page.
 *
 * `metadataBase` still comes from the environment: the canonical URL is a
 * deployment fact, not something an editor should be able to change.
 */
export function buildMetadata(site: SiteContent, overrides: Metadata = {}): Metadata {
  const titleBase = site.tagline ? `${site.name} — ${site.tagline}` : site.name;
  const title = site.seo.metaTitle ?? titleBase;
  const description = site.seo.metaDescription ?? site.description ?? undefined;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s · ${site.name}`,
    },
    description,
    applicationName: site.name,
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.name,
    keywords: [
      "Chayar Asroy",
      "Bangladesh nonprofit",
      "children charity",
      "art education",
      "student-led initiative",
      "Dhaka volunteering",
    ],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: site.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    ...overrides,
  };
}

/** Async wrapper for `generateMetadata()`. The fetch is request-cached. */
export async function generateSiteMetadata(overrides: Metadata = {}): Promise<Metadata> {
  const site = await getSiteContent();
  return buildMetadata(site, overrides);
}
