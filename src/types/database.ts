/**
 * Database types — the application's view of `supabase/migrations/`.
 *
 * Since Phase 5D these are **derived from the generated types** in
 * `database.generated.ts` rather than hand-authored. The generated file is the
 * schema's literal mirror (regenerate it with the command below); this module
 * exists to give the rest of the app short, stable names for the shapes it uses
 * so 30+ files never repeat `Database["public"]["Tables"]["programs"]["Row"]`.
 *
 * Deriving rather than duplicating removed two real problems:
 *   · the hand-authored copy could silently drift from the schema, which is why
 *     it needed a parity test to police it;
 *   · it declared `Relationships: []`, so PostgREST embeds (`media:media_id(…)`)
 *     failed to type-check — the public content queries need those joins.
 *
 * ⚠️ Do NOT overwrite this file with generator output. It is the app-facing
 * API; the generator's output belongs in `database.generated.ts`:
 *
 *   pnpm dlx supabase gen types typescript --linked > src/types/database.generated.ts
 *
 * See `docs/BACKEND.md` §1.
 */

import type { Database as Generated } from "./database.generated";

export type { Json } from "./database.generated";

export type Database = Generated;

/** Convenience aliases so callers never repeat the deep generic paths. */
export type Tables = Database["public"]["Tables"];
export type TableName = keyof Tables;
export type Row<T extends TableName> = Tables[T]["Row"];
export type InsertPayload<T extends TableName> = Tables[T]["Insert"];
export type UpdatePayload<T extends TableName> = Tables[T]["Update"];

type Enums = Database["public"]["Enums"];

export type UserRole = Enums["user_role"];
export type ContentStatus = Enums["content_status"];
export type ProgramCategory = Enums["program_category"];

/** One named row type per table — the shapes components and actions consume. */
export type Profile = Row<"profiles">;
export type Media = Row<"media">;
export type SiteSettings = Row<"site_settings">;
export type NavigationItem = Row<"navigation_items">;
export type SocialLink = Row<"social_links">;
export type Page = Row<"pages">;
export type Program = Row<"programs">;
export type GalleryAlbum = Row<"gallery_albums">;
export type GalleryItem = Row<"gallery_items">;
export type Story = Row<"stories">;
export type Testimonial = Row<"testimonials">;
export type ImpactStat = Row<"impact_stats">;
