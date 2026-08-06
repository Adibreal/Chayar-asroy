import "server-only";

import { cache } from "react";

import type { GalleryItemData } from "@/components/gallery";
import { createPublicClient } from "@/lib/supabase/public";

import { type JoinedMedia, toImageAsset } from "./media";

/**
 * Published photographs, grouped by the event they belong to.
 *
 * **One query backs the whole gallery.** `getGalleryEvents()` is the only place
 * that reads `gallery_items`; the flat list the homepage wants and the single
 * event a detail page wants are both derived from it, in memory, through
 * React's `cache()`. So the event index, an event page and the homepage preview
 * cannot disagree about what is published — and there is no second copy of the
 * grouping, the consent rule, or the row → view-model mapping anywhere.
 *
 * The grouping itself is not new data: it is `gallery_items.program_id`, the
 * relationship the images were imported with, read back.
 */

type GalleryRow = {
  id: string;
  caption: string | null;
  media: (JoinedMedia & { consent_verified: boolean }) | null;
  program: {
    slug: string;
    title: string;
    summary: string;
    event_date: string | null;
    location: string | null;
    status: string;
  } | null;
};

/** An event and its photographs. `slug` is null for images with no event. */
export type GalleryEvent = {
  slug: string | null;
  title: string;
  summary: string | null;
  eventDate: string | null;
  location: string | null;
  images: GalleryItemData[];
};

/**
 * The one row → view-model mapping for a gallery image.
 *
 * Deliberately not exported: every gallery image in the app now comes from the
 * single query below, so there is nowhere else that needs to map one. Export it
 * again only if a genuinely different query appears — and then this stays the
 * only place the consent re-check is written.
 */
function toGalleryItem(
  supabase: NonNullable<ReturnType<typeof createPublicClient>>,
  row: {
    id: string;
    caption: string | null;
    media: (JoinedMedia & { consent_verified: boolean }) | null;
  },
): GalleryItemData[] {
  // Defence in depth: the database refuses to publish an item without consent,
  // and the public site re-checks before rendering a face.
  if (!row.media?.consent_verified) return [];
  const image = toImageAsset(supabase, row.media);
  return [
    {
      id: row.id,
      ...(image ? { image } : {}),
      ...(row.caption ? { caption: row.caption } : {}),
      consentVerified: true,
    },
  ];
}

/** Images with no event still belong somewhere, rather than vanishing. */
const UNGROUPED_TITLE = "More moments";

export const getGalleryEvents = cache(async (): Promise<GalleryEvent[]> => {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("gallery_items")
    .select(
      "id, caption, order_index, media:media_id(bucket_id, storage_path, alt_text, consent_verified), program:program_id(slug, title, summary, event_date, location, status)",
    )
    .eq("status", "published")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("[content] gallery query failed:", error.message);
    return [];
  }

  const events = new Map<string, GalleryEvent>();

  for (const row of (data ?? []) as unknown as GalleryRow[]) {
    const images = toGalleryItem(supabase, row);
    if (images.length === 0) continue;

    // An image whose programme is draft or archived is grouped as ungrouped
    // rather than under an event that has no public page to link to.
    const programme = row.program?.status === "published" ? row.program : null;
    const key = programme?.slug ?? "";

    const existing = events.get(key);
    if (existing) {
      existing.images.push(...images);
      continue;
    }

    events.set(key, {
      slug: programme?.slug ?? null,
      title: programme?.title ?? UNGROUPED_TITLE,
      summary: programme?.summary ?? null,
      eventDate: programme?.event_date ?? null,
      location: programme?.location ?? null,
      images,
    });
  }

  // Most recent event first — this is a journey, and the newest chapter leads.
  // Undated events, and the ungrouped bucket, sort last.
  return [...events.values()].sort((a, b) => {
    if (a.slug === null) return 1;
    if (b.slug === null) return -1;
    if (a.eventDate === b.eventDate) return a.title.localeCompare(b.title);
    if (!a.eventDate) return 1;
    if (!b.eventDate) return -1;
    return b.eventDate.localeCompare(a.eventDate);
  });
});

/** One event's photographs, or null when the slug is unknown. */
export const getGalleryEvent = cache(async (slug: string): Promise<GalleryEvent | null> => {
  const events = await getGalleryEvents();
  return events.find((event) => event.slug === slug) ?? null;
});

/** Slugs of every event with photographs — used to prerender the detail pages. */
export const getGalleryEventSlugs = cache(async (): Promise<string[]> => {
  const events = await getGalleryEvents();
  return events.flatMap((event) => (event.slug ? [event.slug] : []));
});

/**
 * Every published photograph as one flat list.
 *
 * @param shuffle randomises the order. The homepage uses this so its four-image
 * preview is a different set each time the page is regenerated — see the
 * `revalidate` on `app/page.tsx`, which is what turns "random once at build"
 * into "rotates over time" without giving up static rendering.
 * @param limit caps the result. Applied *after* shuffling, so a limited set is
 * drawn from the whole gallery rather than from the first N rows.
 */
export const getGalleryImages = cache(
  async ({ shuffle = false, limit }: { shuffle?: boolean; limit?: number } = {}): Promise<
    GalleryItemData[]
  > => {
    const events = await getGalleryEvents();
    const items = events.flatMap((event) => event.images);

    // Fisher–Yates on a copy: the array above is derived from a `cache()`d
    // result, so shuffling in place would reorder it for every other caller.
    if (shuffle) {
      const pool = [...items];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j]!, pool[i]!];
      }
      return limit === undefined ? pool : pool.slice(0, limit);
    }

    return limit === undefined ? items : items.slice(0, limit);
  },
);
