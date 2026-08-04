# Database schema

Source of truth: `supabase/migrations/`. This document explains the _shape and
reasoning_; the SQL is authoritative.

Every table carries `id uuid` (primary key), `created_at`, `updated_at`
(maintained by the shared `set_updated_at()` trigger), and has RLS enabled.

---

## Relationships

```
auth.users ──1:1──> profiles ──┐
                               ├──> media.uploaded_by
                               └──> *.updated_by  (audit trail)

media ──┬──> site_settings.logo_media_id / default_og_media_id
        ├──> programs.cover_media_id
        ├──> stories.hero_media_id
        ├──> gallery_albums.cover_media_id
        ├──> gallery_items.media_id      (CASCADE — the item *is* the image)
        ├──> testimonials.avatar_media_id
        └──> pages.hero_media_id / og_media_id

gallery_albums ──1:N──> gallery_items
navigation_items ──self-referencing (parent_id) for nested menus
```

**Delete behaviour is deliberate:** media references use `on delete set null`,
so removing an image never destroys the content around it. The single exception
is `gallery_items.media_id` (`cascade`) — without its image the row is
meaningless.

---

## Tables

### Identity

| Table      | Purpose                                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `profiles` | 1:1 with `auth.users`; holds `role` and display data. Auto-created by the `on_auth_user_created` trigger, so a signed-in user always has a profile. |

### Media

| Table   | Notes                                                                                                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `media` | The one media library. `alt_text` is `not null` (accessibility) and `consent_verified` gates publishing photos of identifiable children. Unique on `(bucket_id, storage_path)`. |

### Configuration

| Table              | Notes                                                                                                                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site_settings`    | **Singleton**, enforced by `is_singleton boolean unique check (is_singleton)` — a neat way to make "exactly one row" a database rule. Holds identity, contact details, the one primary CTA, the current campaign and SEO defaults. |
| `navigation_items` | The IA. `is_available = false` hides routes that aren't built, so the site never advertises a 404. Self-referencing for future sub-menus.                                                                                          |
| `social_links`     | One row per platform, `platform` unique. Adding a platform is data, not code.                                                                                                                                                      |

### Editorial content

| Table                              | Notes                                                                                                                                                                                                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages`                            | Route-level content + SEO for singleton pages. `content jsonb` lets a page's composition evolve without a migration (validated by Zod in the app). **Images are columns, never jsonb** — `hero_media_id` is the page's photograph, `og_media_id` its social-sharing card. |
| `programs`                         | Programmes. `is_featured` + `order_index` drive the homepage.                                                                                                                                                                                                             |
| `gallery_albums` / `gallery_items` | Albums are optional — an item can stand alone. Items also carry `photographer` (credit), `category` (free text, so volunteers can add a grouping without a migration) and `is_featured` — all added in `0005`.                                                            |
| `stories`                          | Long-form narratives.                                                                                                                                                                                                                                                     |
| `testimonials`                     | Short quotes; attribution deliberately minimal (first name + age) to protect children.                                                                                                                                                                                    |
| `impact_stats`                     | Headline numbers.                                                                                                                                                                                                                                                         |

All editorial tables share the `content_status` lifecycle
(`draft | published | archived`) and carry their own `meta_title` /
`meta_description`.

> **Why SEO columns per table rather than a polymorphic `seo_metadata` table?**
> A polymorphic table can't have real foreign keys, so integrity would depend on
> application code. Per-table columns keep referential integrity and are simpler
> to query. `pages` covers route-level SEO for static pages.

---

## Enums

| Enum               | Values                           |
| ------------------ | -------------------------------- |
| `user_role`        | `super_admin`, `admin`, `editor` |
| `content_status`   | `draft`, `published`, `archived` |
| `program_category` | `art`, `education`, `community`  |

Extend with `alter type … add value` — no table rewrite.

---

## Indexes

Added where a real query needs them, not speculatively:

- `programs (status, is_featured, order_index)` — the homepage query
- `stories (status, published_at desc)` — the stories listing
- `gallery_items (album_id, order_index)` — album contents
- `gallery_items (status, is_featured, order_index)` — the public gallery query
- `media (created_at desc)` — the media library's default view
- `profiles (role)` — admin user lists

---

## Migrations

| File                            | Contents                                                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `0001_foundation.sql`           | Extensions, enums, `set_updated_at()`, `profiles`, auth helpers                                                                      |
| `0002_content.sql`              | Media, configuration and editorial tables                                                                                            |
| `0003_rls.sql`                  | RLS policies + the consent publishing gate                                                                                           |
| `0004_storage.sql`              | Buckets and storage policies                                                                                                         |
| `0005_gallery_fields.sql`       | `gallery_items`: `photographer`, `category`, `is_featured` + index                                                                   |
| `0006_gallery_item_audit.sql`   | `gallery_items.updated_by` — the audit column every sibling table already had                                                        |
| `0007_consent_message.sql`      | Rewords the consent refusal; editors now see it verbatim in the CMS                                                                  |
| `0008_impact_stat_icon.sql`     | `impact_stats.icon` — icon name resolved by the app's registry                                                                       |
| `0009_program_story_fields.sql` | `programs`: `event_date`, `location`, `participation`, `activities`, `objectives[]`, `volunteers[]`; plus `gallery_items.program_id` |
| `0010_campaign_background.sql`  | `site_settings.campaign_media_id` — background photo for the campaign band                                                           |
| `0011_page_hero_media.sql`      | `pages.hero_media_id` + backfill from the old `content.heroMediaId` jsonb key, which it then drops                                   |
| `seed.sql`                      | Initial data + placeholder homepage content (idempotent)                                                                             |

Migrations are **append-only** — never edit a file that has run in production;
add a new one. Name them `NNNN_description.sql` in order.
