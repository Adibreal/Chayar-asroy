/**
 * Database types — the TypeScript mirror of `supabase/migrations/`.
 *
 * Hand-authored so the project is fully typed before a Supabase project
 * exists. Once one is provisioned, regenerate to guarantee drift-free types:
 *
 *   pnpm dlx supabase gen types typescript --project-id <ref> > src/types/database.ts
 *
 * Keep the shape (`Row` / `Insert` / `Update` per table) — the rest of the
 * backend is written against it.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "super_admin" | "admin" | "editor";
export type ContentStatus = "draft" | "published" | "archived";
export type ProgramCategory = "art" | "education" | "community";

/** Columns every table carries. */
type Timestamps = {
  created_at: string;
  updated_at: string;
};

/** Shapes one table for supabase-js: full row, insert payload, patch payload. */
type TableDef<Row, RequiredOnInsert extends keyof Row> = {
  Row: Row;
  Insert: Pick<Row, RequiredOnInsert> & Partial<Omit<Row, RequiredOnInsert>>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Profile = Timestamps & {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
};

export type Media = Timestamps & {
  id: string;
  bucket_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt_text: string;
  caption: string | null;
  consent_verified: boolean;
  uploaded_by: string | null;
};

export type SiteSettings = Timestamps & {
  id: string;
  is_singleton: boolean;
  org_name: string;
  org_name_bn: string | null;
  tagline: string | null;
  description: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  location: string | null;
  logo_media_id: string | null;
  primary_cta_label: string | null;
  primary_cta_href: string | null;
  primary_cta_enabled: boolean;
  campaign_eyebrow: string | null;
  campaign_title: string | null;
  campaign_description: string | null;
  default_meta_title: string | null;
  default_meta_description: string | null;
  default_og_media_id: string | null;
  updated_by: string | null;
};

export type NavigationItem = Timestamps & {
  id: string;
  label: string;
  href: string;
  parent_id: string | null;
  order_index: number;
  is_available: boolean;
};

export type SocialLink = Timestamps & {
  id: string;
  platform: string;
  label: string;
  href: string;
  order_index: number;
  is_visible: boolean;
};

export type Page = Timestamps & {
  id: string;
  slug: string;
  title: string;
  content: Json;
  status: ContentStatus;
  meta_title: string | null;
  meta_description: string | null;
  og_media_id: string | null;
  published_at: string | null;
  updated_by: string | null;
};

export type Program = Timestamps & {
  id: string;
  slug: string;
  title: string;
  category: ProgramCategory;
  summary: string;
  body: string | null;
  cover_media_id: string | null;
  order_index: number;
  is_featured: boolean;
  status: ContentStatus;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  updated_by: string | null;
};

export type GalleryAlbum = Timestamps & {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  event_date: string | null;
  cover_media_id: string | null;
  order_index: number;
  status: ContentStatus;
  updated_by: string | null;
};

export type GalleryItem = Timestamps & {
  id: string;
  album_id: string | null;
  media_id: string;
  caption: string | null;
  photographer: string | null;
  category: string | null;
  is_featured: boolean;
  order_index: number;
  status: ContentStatus;
};

export type Story = Timestamps & {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string | null;
  hero_media_id: string | null;
  author_name: string | null;
  order_index: number;
  is_featured: boolean;
  status: ContentStatus;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  updated_by: string | null;
};

export type Testimonial = Timestamps & {
  id: string;
  quote: string;
  author_name: string;
  author_meta: string | null;
  avatar_media_id: string | null;
  order_index: number;
  status: ContentStatus;
};

export type ImpactStat = Timestamps & {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  order_index: number;
  is_visible: boolean;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<Profile, "id" | "email">;
      media: TableDef<Media, "storage_path" | "file_name" | "mime_type" | "size_bytes">;
      site_settings: TableDef<SiteSettings, "org_name">;
      navigation_items: TableDef<NavigationItem, "label" | "href">;
      social_links: TableDef<SocialLink, "platform" | "label" | "href">;
      pages: TableDef<Page, "slug" | "title">;
      programs: TableDef<Program, "slug" | "title" | "category" | "summary">;
      gallery_albums: TableDef<GalleryAlbum, "slug" | "title">;
      gallery_items: TableDef<GalleryItem, "media_id">;
      stories: TableDef<Story, "slug" | "title" | "excerpt">;
      testimonials: TableDef<Testimonial, "quote" | "author_name">;
      impact_stats: TableDef<ImpactStat, "label" | "value">;
    };
    Views: Record<never, never>;
    Functions: {
      current_user_role: { Args: Record<never, never>; Returns: UserRole | null };
      can_edit: { Args: Record<never, never>; Returns: boolean };
      is_admin: { Args: Record<never, never>; Returns: boolean };
      is_super_admin: { Args: Record<never, never>; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      content_status: ContentStatus;
      program_category: ProgramCategory;
    };
    CompositeTypes: Record<never, never>;
  };
};

/** Convenience aliases so callers never repeat the deep generic paths. */
export type Tables = Database["public"]["Tables"];
export type TableName = keyof Tables;
export type Row<T extends TableName> = Tables[T]["Row"];
export type InsertPayload<T extends TableName> = Tables[T]["Insert"];
export type UpdatePayload<T extends TableName> = Tables[T]["Update"];
