import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

/**
 * Build a page `Metadata` object from sensible, brand-consistent defaults.
 * Pages pass overrides (title, description, openGraph, …) which are shallow
 * -merged over the defaults.
 *
 * The root layout calls `buildMetadata()` with no arguments to establish the
 * site-wide baseline (title template, Open Graph, Twitter, robots).
 */
export function buildMetadata(overrides: Metadata = {}): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${siteConfig.tagline}`,
      template: `%s · ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
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
      siteName: siteConfig.name,
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      description: siteConfig.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    ...overrides,
  };
}
