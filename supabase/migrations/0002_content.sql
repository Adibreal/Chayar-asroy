-- ===========================================================================
-- 0002_content.sql — media library, site configuration and editorial content
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- media — the single media library. Every image on the site is a row here;
-- content tables reference it rather than storing loose URLs, so alt text and
-- consent are recorded once and reused everywhere.
-- ---------------------------------------------------------------------------

create table public.media (
  id            uuid primary key default gen_random_uuid(),
  bucket_id     text not null default 'media',
  storage_path  text not null,
  file_name     text not null,
  mime_type     text not null,
  size_bytes    integer not null check (size_bytes >= 0),
  width         integer check (width > 0),
  height        integer check (height > 0),
  -- Required for accessibility. Decorative images use an explicit empty string.
  alt_text      text not null default '',
  caption       text,
  -- Guardian consent for identifiable children. Publishing is gated on this.
  consent_verified boolean not null default false,
  uploaded_by   uuid references public.profiles (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (bucket_id, storage_path)
);

comment on table public.media is 'Central media library backing all imagery.';
comment on column public.media.consent_verified is
  'Guardian consent to publish an identifiable child. Never publish without it.';

create index media_created_at_idx on public.media (created_at desc);

create trigger media_set_updated_at
  before update on public.media
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- site_settings — singleton row holding organisation-wide configuration:
-- identity, contact details, the one primary CTA and the current campaign.
-- Mirrors `src/config/site.ts`, which becomes its fallback.
-- ---------------------------------------------------------------------------

create table public.site_settings (
  id              uuid primary key default gen_random_uuid(),
  -- Enforces exactly one row: the singleton guard.
  is_singleton    boolean not null default true unique check (is_singleton),

  org_name        text not null,
  org_name_bn     text,
  tagline         text,
  description     text,

  contact_email   text,
  contact_phone   text,
  location        text,

  logo_media_id   uuid references public.media (id) on delete set null,

  -- The single primary call-to-action reused by navbar, hero and campaign band.
  primary_cta_label   text,
  primary_cta_href    text,
  primary_cta_enabled boolean not null default true,

  -- Current campaign shown in the homepage CTA band.
  campaign_eyebrow      text,
  campaign_title        text,
  campaign_description  text,

  -- Site-wide SEO defaults.
  default_meta_title        text,
  default_meta_description  text,
  default_og_media_id       uuid references public.media (id) on delete set null,

  updated_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.site_settings is
  'Singleton (enforced by is_singleton) of organisation-wide settings.';

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- navigation_items — the site's information architecture.
-- `is_available` hides routes that are not built yet (see NavLinks).
-- ---------------------------------------------------------------------------

create table public.navigation_items (
  id            uuid primary key default gen_random_uuid(),
  label         text not null,
  href          text not null,
  parent_id     uuid references public.navigation_items (id) on delete cascade,
  order_index   integer not null default 0,
  is_available  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index navigation_items_order_idx on public.navigation_items (order_index);
create index navigation_items_parent_idx on public.navigation_items (parent_id);

create trigger navigation_items_set_updated_at
  before update on public.navigation_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- social_links — one row per platform; adding a platform is a data change.
-- ---------------------------------------------------------------------------

create table public.social_links (
  id           uuid primary key default gen_random_uuid(),
  platform     text not null unique,
  label        text not null,
  href         text not null,
  order_index  integer not null default 0,
  is_visible   boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger social_links_set_updated_at
  before update on public.social_links
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- pages — route-level content & SEO for singleton pages (home, contact…).
-- `content` is jsonb so a page's section composition can evolve without a
-- migration; the shape is validated in the app by Zod.
-- ---------------------------------------------------------------------------

create table public.pages (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  content           jsonb not null default '{}'::jsonb,
  status            public.content_status not null default 'draft',
  meta_title        text,
  meta_description  text,
  og_media_id       uuid references public.media (id) on delete set null,
  published_at      timestamptz,
  updated_by        uuid references public.profiles (id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index pages_status_idx on public.pages (status);

create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- programs — the organisation's programmes ("projects" on the public site).
-- ---------------------------------------------------------------------------

create table public.programs (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  category          public.program_category not null,
  summary           text not null,
  body              text,
  cover_media_id    uuid references public.media (id) on delete set null,
  order_index       integer not null default 0,
  is_featured       boolean not null default false,
  status            public.content_status not null default 'draft',
  meta_title        text,
  meta_description  text,
  published_at      timestamptz,
  updated_by        uuid references public.profiles (id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Supports the homepage query: featured + published, ordered.
create index programs_featured_idx
  on public.programs (status, is_featured, order_index);

create trigger programs_set_updated_at
  before update on public.programs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- gallery_albums / gallery_items
-- ---------------------------------------------------------------------------

create table public.gallery_albums (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  description     text,
  event_date      date,
  cover_media_id  uuid references public.media (id) on delete set null,
  order_index     integer not null default 0,
  status          public.content_status not null default 'draft',
  updated_by      uuid references public.profiles (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger gallery_albums_set_updated_at
  before update on public.gallery_albums
  for each row execute function public.set_updated_at();

create table public.gallery_items (
  id           uuid primary key default gen_random_uuid(),
  album_id     uuid references public.gallery_albums (id) on delete set null,
  -- The item *is* the image, so removing the media removes the item.
  media_id     uuid not null references public.media (id) on delete cascade,
  caption      text,
  order_index  integer not null default 0,
  status       public.content_status not null default 'draft',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index gallery_items_album_idx on public.gallery_items (album_id, order_index);
create index gallery_items_status_idx on public.gallery_items (status);

create trigger gallery_items_set_updated_at
  before update on public.gallery_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- stories — editorial narratives.
-- ---------------------------------------------------------------------------

create table public.stories (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  excerpt           text not null,
  body              text,
  hero_media_id     uuid references public.media (id) on delete set null,
  author_name       text,
  order_index       integer not null default 0,
  is_featured       boolean not null default false,
  status            public.content_status not null default 'draft',
  meta_title        text,
  meta_description  text,
  published_at      timestamptz,
  updated_by        uuid references public.profiles (id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index stories_published_idx on public.stories (status, published_at desc);

create trigger stories_set_updated_at
  before update on public.stories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- testimonials — short quotes. Attribution is deliberately minimal
-- (first name + age) to protect children.
-- ---------------------------------------------------------------------------

create table public.testimonials (
  id               uuid primary key default gen_random_uuid(),
  quote            text not null,
  author_name      text not null,
  author_meta      text,
  avatar_media_id  uuid references public.media (id) on delete set null,
  order_index      integer not null default 0,
  status           public.content_status not null default 'draft',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- impact_stats — headline numbers.
-- ---------------------------------------------------------------------------

create table public.impact_stats (
  id           uuid primary key default gen_random_uuid(),
  label        text not null,
  value        integer not null,
  suffix       text,
  order_index  integer not null default 0,
  is_visible   boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger impact_stats_set_updated_at
  before update on public.impact_stats
  for each row execute function public.set_updated_at();
