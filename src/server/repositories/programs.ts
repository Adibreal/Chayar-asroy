import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createRepository } from "@/server/db/repository";
import { unwrap } from "@/server/db/query";
import type { Program } from "@/types/database";

/**
 * Programs repository — the reference example for entity repositories.
 *
 * Compose the generic CRUD and add only the queries this entity needs. Public
 * read helpers rely on RLS for the `published` filter but state it explicitly
 * too, so the intent is obvious when reading the code.
 */
const base = createRepository("programs");

export const programsRepository = {
  ...base,

  /** Published, featured programmes for the homepage, in display order. */
  async listFeatured(limit = 3): Promise<Program[]> {
    const supabase = await createClient();
    const response = await supabase
      .from("programs")
      .select("*")
      .eq("status", "published")
      .eq("is_featured", true)
      .order("order_index", { ascending: true })
      .limit(limit);

    return unwrap(response);
  },

  /** All published programmes, in display order. */
  async listPublished(): Promise<Program[]> {
    const supabase = await createClient();
    const response = await supabase
      .from("programs")
      .select("*")
      .eq("status", "published")
      .order("order_index", { ascending: true });

    return unwrap(response);
  },

  /** A single published programme by slug, or `null` for a clean 404. */
  async findPublishedBySlug(slug: string): Promise<Program | null> {
    const supabase = await createClient();
    const { data } = await supabase
      .from("programs")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    return data;
  },
};
