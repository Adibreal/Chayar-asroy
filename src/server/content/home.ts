import "server-only";

import { cache } from "react";

import type { GalleryItemData } from "@/components/gallery";
import type { ImpactEntry } from "@/components/impact";
import { createPublicClient } from "@/lib/supabase/public";
import { toLines } from "@/lib/utils";
import type { ImageAsset, Testimonial } from "@/types";
import { homepageSchema } from "@/validation/content";

import { toImageAsset } from "./media";
import { getPrograms, type ProgramSummary } from "./programs";

/**
 * Homepage content, read from the CMS.
 *
 * Two sources, deliberately:
 *   · section *copy* lives in `pages.content` (jsonb, keyed by slug `home`) so
 *     the page's wording can change without a migration;
 *   · section *lists* (programs, gallery, testimonials, figures) are real rows
 *     in their own tables, edited where each item lives.
 *
 * Everything is mapped here into the exact view models the section components
 * already accept, so no component's props changed for this migration.
 */

const HOME_SLUG = "home";

/** The homepage preview is a single row of three, by design. */
const HOMEPAGE_PROGRAM_COUNT = 3;

export type HomeCopy = {
  hero: {
    eyebrow: string | null;
    title: string;
    description: string | null;
    secondaryCta: { label: string; href: string } | null;
  };
  mission: {
    eyebrow: string | null;
    title: string | null;
    description: string | null;
    pillars: { title: string; body: string }[];
  };
  programs: { eyebrow: string | null; title: string | null; description: string | null };
  gallery: { eyebrow: string | null; title: string | null };
  voices: { quote: string; author: string | null } | null;
  impact: {
    eyebrow: string | null;
    title: string | null;
    description: string | null;
    quote: string | null;
    quoteAttribution: string | null;
  };
  help: {
    eyebrow: string | null;
    title: string | null;
    description: string | null;
    methods: string[];
    cta: { label: string; href: string } | null;
  };
  seo: { metaTitle: string | null; metaDescription: string | null };
};

export type HomeContent = {
  copy: HomeCopy | null;
  heroImage: ImageAsset | null;
  featuredPrograms: ProgramSummary[];
  galleryPreview: GalleryItemData[];
  testimonials: Testimonial[];
  impactStats: ImpactEntry[];
};

const EMPTY: HomeContent = {
  copy: null,
  heroImage: null,
  featuredPrograms: [],
  galleryPreview: [],
  testimonials: [],
  impactStats: [],
};

/**
 * Shape `pages.content` into the page's view model.
 *
 * The stored jsonb is validated with the same schema the editor writes through,
 * so a hand-edited or partially-migrated row can never crash the homepage — it
 * simply yields no copy and the page falls back to rendering nothing.
 */
function toCopy(content: unknown): HomeCopy | null {
  const parsed = homepageSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const pillars = [
    { title: c.missionPillarOneTitle, body: c.missionPillarOneBody },
    { title: c.missionPillarTwoTitle, body: c.missionPillarTwoBody },
  ].flatMap((pillar) =>
    pillar.title && pillar.body ? [{ title: pillar.title, body: pillar.body }] : [],
  );

  return {
    hero: {
      eyebrow: c.heroEyebrow ?? null,
      title: c.heroTitle,
      description: c.heroDescription ?? null,
      secondaryCta:
        c.heroSecondaryCtaLabel && c.heroSecondaryCtaHref
          ? { label: c.heroSecondaryCtaLabel, href: c.heroSecondaryCtaHref }
          : null,
    },
    mission: {
      eyebrow: c.missionEyebrow ?? null,
      title: c.missionTitle ?? null,
      description: c.missionDescription ?? null,
      pillars,
    },
    programs: {
      eyebrow: c.programsEyebrow ?? null,
      title: c.programsTitle ?? null,
      description: c.programsDescription ?? null,
    },
    gallery: { eyebrow: c.galleryEyebrow ?? null, title: c.galleryTitle ?? null },
    voices: c.voicesQuote ? { quote: c.voicesQuote, author: c.voicesAuthor ?? null } : null,
    impact: {
      eyebrow: c.impactEyebrow ?? null,
      title: c.impactTitle ?? null,
      description: c.impactDescription ?? null,
      quote: c.impactQuote ?? null,
      quoteAttribution: c.impactQuoteAttribution ?? null,
    },
    help: {
      eyebrow: c.helpEyebrow ?? null,
      title: c.helpTitle ?? null,
      description: c.helpDescription ?? null,
      methods: toLines(c.helpMethods),
      cta: c.helpCtaLabel && c.helpCtaHref ? { label: c.helpCtaLabel, href: c.helpCtaHref } : null,
    },
    seo: { metaTitle: c.metaTitle ?? null, metaDescription: c.metaDescription ?? null },
  };
}

export const getHomeContent = cache(async (): Promise<HomeContent> => {
  const supabase = createPublicClient();
  if (!supabase) return EMPTY;

  const [pageResult, featuredPrograms, galleryResult, testimonialsResult, statsResult] =
    await Promise.all([
      supabase
        .from("pages")
        // `hero_media_id` is the hero photograph; `og_media_id` is the
        // social-sharing card and is deliberately not read here.
        .select("content, media:hero_media_id(bucket_id, storage_path, alt_text)")
        .eq("slug", HOME_SLUG)
        .eq("status", "published")
        .maybeSingle(),
      // Shared with /programs — one query shape and one mapper, so the card on
      // the homepage and the card on the index can never drift apart.
      //
      // Capped at three: the homepage is a curated preview with a fixed
      // three-card row, and "Explore all programs" leads to the full archive.
      // Featuring a fourth programme in the CMS must not change that layout.
      getPrograms({ featuredOnly: true, limit: HOMEPAGE_PROGRAM_COUNT }),
      supabase
        .from("gallery_items")
        .select("id, caption, media:media_id(bucket_id, storage_path, alt_text, consent_verified)")
        .eq("status", "published")
        .order("order_index", { ascending: true })
        .limit(8),
      supabase
        .from("testimonials")
        .select(
          "quote, author_name, author_meta, media:avatar_media_id(bucket_id, storage_path, alt_text)",
        )
        .eq("status", "published")
        .order("order_index", { ascending: true }),
      supabase
        .from("impact_stats")
        .select("label, value, suffix, icon")
        .eq("is_visible", true)
        .order("order_index", { ascending: true }),
    ]);

  for (const [name, result] of [
    ["pages", pageResult],
    ["gallery_items", galleryResult],
    ["testimonials", testimonialsResult],
    ["impact_stats", statsResult],
  ] as const) {
    if (result.error)
      console.error(`[content] homepage ${name} query failed:`, result.error.message);
  }

  const copy = toCopy(pageResult.data?.content);

  return {
    copy,
    /*
     * Alt text is required in the media library, so the fallback is a last
     * resort for images uploaded before that rule existed — never a silent
     * `alt=""` on the most prominent image on the site. The headline is the
     * message the photograph carries, and it is editor-written rather than
     * invented here.
     */
    heroImage: toImageAsset(supabase, pageResult.data?.media ?? null, copy?.hero.title),
    featuredPrograms,
    galleryPreview: (galleryResult.data ?? []).flatMap((row) => {
      // Defence in depth: the database already refuses to publish an item
      // without consent, but the public site re-checks before rendering a face.
      if (!row.media?.consent_verified) return [];
      const image = toImageAsset(supabase, row.media);
      return [
        {
          id: row.id,
          ...(image ? { image } : {}),
          ...(row.caption ? { caption: row.caption } : {}),
          consentVerified: true,
        } satisfies GalleryItemData,
      ];
    }),
    testimonials: (testimonialsResult.data ?? []).map((row) => {
      const avatar = toImageAsset(supabase, row.media);
      return {
        quote: row.quote,
        name: row.author_name,
        ...(row.author_meta ? { meta: row.author_meta } : {}),
        ...(avatar ? { avatar } : {}),
      } satisfies Testimonial;
    }),
    impactStats: (statsResult.data ?? []).map((row) => ({
      value: row.value,
      label: row.label,
      ...(row.suffix ? { suffix: row.suffix } : {}),
      ...(isImpactIcon(row.icon) ? { icon: row.icon } : {}),
    })),
  };
});

const IMPACT_ICONS = ["children", "hands", "workshop", "community"] as const;

/** Unknown icon names render without a glyph rather than crashing. */
function isImpactIcon(value: string | null): value is (typeof IMPACT_ICONS)[number] {
  return value !== null && (IMPACT_ICONS as readonly string[]).includes(value);
}
