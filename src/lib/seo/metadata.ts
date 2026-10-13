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

  // What a shared link shows is built from the page's own title, description
  // and address — previously every page advertised the homepage's.
  const { openGraph, twitter, ...rest } = overrides;
  const pageTitle = typeof overrides.title === "string" ? overrides.title : title;
  const pageDescription = overrides.description ?? description;
  const canonical = overrides.alternates?.canonical;
  const pageUrl =
    typeof canonical === "string" || canonical instanceof URL ? canonical : siteConfig.url;
  const images = site.shareImage
    ? [
        {
          url: site.shareImage.src,
          alt: site.shareImage.alt,
          ...(site.shareImage.width ? { width: site.shareImage.width } : {}),
          ...(site.shareImage.height ? { height: site.shareImage.height } : {}),
        },
      ]
    : undefined;

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
      url: pageUrl,
      siteName: site.name,
      title: pageTitle,
      description: pageDescription ?? undefined,
      ...(images ? { images } : {}),
      // A page's own Open Graph fields (a programme's cover photo) win, but
      // merge into the defaults instead of replacing them wholesale.
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription ?? undefined,
      ...(images ? { images } : {}),
      ...(openGraph?.images ? { images: openGraph.images } : {}),
      ...twitter,
    } as Metadata["twitter"],
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    ...rest,
  };
}

/** Async wrapper for `generateMetadata()`. The fetch is request-cached. */
export async function generateSiteMetadata(overrides: Metadata = {}): Promise<Metadata> {
  const site = await getSiteContent();
  return buildMetadata(site, overrides);
}
