import "server-only";

import { cache } from "react";

import { siteConfig } from "@/config/site";
import { createPublicClient } from "@/lib/supabase/public";
import type { ImageAsset } from "@/types";

import { toImageAsset } from "./media";

/**
 * Site-wide content, read from the CMS.
 *
 * One request-scoped fetch shared by the header, footer and page metadata via
 * React's `cache()`, so the shell never queries the same rows three times.
 *
 * Reads go through the cookie-less public client, which keeps public routes
 * statically renderable; the CMS actions already `revalidatePath("/", "layout")`
 * when settings change, so edits still propagate.
 */

export type SiteNavItem = {
  label: string;
  href: string;
  /** False while the route isn't built — never advertise a page that 404s. */
  available: boolean;
};

export type SiteSocial = { platform: string; label: string; href: string };

export type SiteCta = { label: string; href: string; enabled: boolean };

export type SiteContent = {
  name: string;
  nameBn: string | null;
  tagline: string | null;
  description: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  location: string | null;
  primaryCta: SiteCta | null;
  campaign: {
    eyebrow: string | null;
    title: string;
    description: string | null;
    /** Blurred behind the band. Null falls back to the brand placeholder. */
    image: ImageAsset | null;
  } | null;
  seo: { metaTitle: string | null; metaDescription: string | null };
  nav: SiteNavItem[];
  socials: SiteSocial[];
};

/**
 * Used only when Supabase is not configured at all (e.g. a fresh clone, or a
 * CI build with no secrets). It is deliberately the bare brand identity — not
 * a second copy of the site's content — so an unconfigured deploy renders a
 * coherent, empty shell instead of a blank page. See `siteConfig.fallback`.
 */
function fallbackContent(): SiteContent {
  const { name, nameBn, tagline, description } = siteConfig.fallback;
  return {
    name,
    nameBn,
    tagline,
    description,
    contactEmail: null,
    contactPhone: null,
    location: null,
    primaryCta: null,
    campaign: null,
    seo: { metaTitle: null, metaDescription: null },
    nav: [],
    socials: [],
  };
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const supabase = createPublicClient();
  if (!supabase) return fallbackContent();

  const [settingsResult, navResult, socialsResult] = await Promise.all([
    supabase
      .from("site_settings")
      .select(
        "*, campaignMedia:campaign_media_id(bucket_id, storage_path, alt_text, width, height)",
      )
      .maybeSingle(),
    supabase
      .from("navigation_items")
      .select("label, href, is_available, order_index")
      .order("order_index", { ascending: true }),
    supabase
      .from("social_links")
      .select("platform, label, href, order_index")
      .eq("is_visible", true)
      .order("order_index", { ascending: true }),
  ]);

  const settings = settingsResult.data;

  if (settingsResult.error || !settings) {
    // Configured but unreadable: say so in the server log rather than quietly
    // serving something that looks fine. The shell still renders.
    console.error(
      "[content] site_settings unavailable — falling back to brand identity:",
      settingsResult.error?.message ?? "no row",
    );
    return fallbackContent();
  }

  return {
    name: settings.org_name,
    nameBn: settings.org_name_bn,
    tagline: settings.tagline,
    description: settings.description,
    contactEmail: settings.contact_email,
    contactPhone: settings.contact_phone,
    location: settings.location,
    primaryCta: settings.primary_cta_label
      ? {
          label: settings.primary_cta_label,
          href: settings.primary_cta_href ?? "#",
          enabled: settings.primary_cta_enabled,
        }
      : null,
    campaign: settings.campaign_title
      ? {
          eyebrow: settings.campaign_eyebrow,
          title: settings.campaign_title,
          description: settings.campaign_description,
          image: toImageAsset(supabase, settings.campaignMedia),
        }
      : null,
    seo: {
      metaTitle: settings.default_meta_title,
      metaDescription: settings.default_meta_description,
    },
    nav: (navResult.data ?? []).map((item) => ({
      label: item.label,
      href: item.href,
      available: item.is_available,
    })),
    socials: (socialsResult.data ?? []).map((social) => ({
      platform: social.platform,
      label: social.label,
      href: social.href,
    })),
  };
});

/**
 * Predicate for "is this route built yet?", bound to the CMS navigation.
 *
 * Replaces the old `isRouteAvailable()` that read the hardcoded config. Built
 * once per render and passed down, so section CTAs and cards never each query
 * the navigation themselves.
 */
export function createRouteAvailability(nav: SiteNavItem[]) {
  const available = new Set(nav.filter((item) => item.available).map((item) => item.href));
  return (href: string) => available.has(href);
}
