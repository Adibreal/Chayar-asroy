import "server-only";

import { cache } from "react";

import type { GalleryItemData } from "@/components/gallery";
import { createPublicClient } from "@/lib/supabase/public";
import type { Program } from "@/types";

import { toImageAsset } from "./media";

/**
 * Programme content for the public site.
 *
 * `getPrograms()` backs both the homepage preview (featured only) and the
 * `/programs` index (everything published) — one query shape, one mapper, so
 * the two pages can never disagree about what a programme looks like.
 *
 * `getProgramBySlug()` adds the story fields and the programme's own gallery.
 */

/** The list-level shape: everything a card needs. */
export type ProgramSummary = Program & {
  eventDate: string | null;
  location: string | null;
  participation: string | null;
};

/** The page-level shape: the summary plus the full story. */
export type ProgramDetail = ProgramSummary & {
  activities: string | null;
  objectives: string[];
  /**
   * The event told as one continuous read: overview, then what happened, then
   * why it was run — the order the source documentation was written in.
   *
   * The CMS keeps the three parts in separate columns because they are easier
   * to write and revise that way; the public page joins them because a reader
   * wants a story, not a form. Composed here so the page has no assembly logic
   * and any future page reading a programme gets the same narrative.
   */
  narrative: string;
  volunteers: string[];
  gallery: GalleryItemData[];
};

const LIST_COLUMNS =
  "slug, title, category, summary, order_index, event_date, location, participation, media:cover_media_id(bucket_id, storage_path, alt_text)";

/** Rows shaped by `LIST_COLUMNS`, mapped to the card view model. */
type ListRow = {
  slug: string;
  title: string;
  category: Program["category"];
  summary: string;
  order_index: number;
  event_date: string | null;
  location: string | null;
  participation: string | null;
  media: { bucket_id: string; storage_path: string; alt_text: string } | null;
};

function toSummary(
  supabase: NonNullable<ReturnType<typeof createPublicClient>>,
  row: ListRow,
): ProgramSummary {
  const cover = toImageAsset(supabase, row.media);
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    summary: row.summary,
    order: row.order_index,
    eventDate: row.event_date,
    location: row.location,
    participation: row.participation,
    ...(cover ? { coverImage: cover } : {}),
  };
}

/**
 * Published programmes, in display order.
 *
 * @param featuredOnly restricts to the homepage's curated set. Which programmes
 * are featured is the `is_featured` flag in the CMS — never a hardcoded list.
 * @param limit caps how many are returned. The homepage is a preview with a
 * fixed three-card row, so it asks for three however many are flagged featured;
 * `/programs` passes no limit because it is the complete archive.
 */
export const getPrograms = cache(
  async ({ featuredOnly = false, limit }: { featuredOnly?: boolean; limit?: number } = {}): Promise<
    ProgramSummary[]
  > => {
    const supabase = createPublicClient();
    if (!supabase) return [];

    let query = supabase
      .from("programs")
      .select(LIST_COLUMNS)
      .eq("status", "published")
      .order("order_index", { ascending: true });

    if (featuredOnly) query = query.eq("is_featured", true);
    if (limit !== undefined) query = query.limit(limit);

    const { data, error } = await query;
    if (error) {
      console.error("[content] programs query failed:", error.message);
      return [];
    }

    return (data ?? []).map((row) => toSummary(supabase, row as ListRow));
  },
);

/** Slugs of every published programme — used to prerender the detail pages. */
export const getProgramSlugs = cache(async (): Promise<string[]> => {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("programs").select("slug").eq("status", "published");

  if (error) {
    console.error("[content] program slugs query failed:", error.message);
    return [];
  }
  return (data ?? []).map((row) => row.slug);
});

/** One published programme with its story and gallery, or null when unknown. */
export const getProgramBySlug = cache(async (slug: string): Promise<ProgramDetail | null> => {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("programs")
    .select(`id, body, activities, objectives, volunteers, ${LIST_COLUMNS}`)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[content] program detail query failed:", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as unknown as ListRow & {
    id: string;
    body: string | null;
    activities: string | null;
    objectives: string[] | null;
    volunteers: string[] | null;
  };

  // The programme's own gallery. Consent is enforced by a database trigger on
  // publish, and re-checked here before a face is ever rendered.
  const { data: images, error: galleryError } = await supabase
    .from("gallery_items")
    .select("id, caption, media:media_id(bucket_id, storage_path, alt_text, consent_verified)")
    .eq("program_id", row.id)
    .eq("status", "published")
    .order("order_index", { ascending: true });

  if (galleryError) {
    console.error("[content] program gallery query failed:", galleryError.message);
  }

  const gallery = (images ?? []).flatMap((item): GalleryItemData[] => {
    if (!item.media?.consent_verified) return [];
    const image = toImageAsset(supabase, item.media);
    return [
      {
        id: item.id,
        ...(image ? { image } : {}),
        ...(item.caption ? { caption: item.caption } : {}),
        consentVerified: true,
      },
    ];
  });

  const objectives = row.objectives ?? [];

  /**
   * Objectives are stored one per line but were written as a single paragraph;
   * rejoining them restores that paragraph exactly, so the narrative reads as
   * originally written rather than as a list bolted onto prose.
   */
  const narrative = [row.body, row.activities, objectives.join(" ")]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join("\n\n");

  return {
    ...toSummary(supabase, row),
    ...(row.body ? { body: row.body } : {}),
    activities: row.activities,
    objectives,
    narrative,
    volunteers: row.volunteers ?? [],
    gallery,
  };
});
