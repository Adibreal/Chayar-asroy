-- ===========================================================================
-- 0005_gallery_fields.sql — photographer credit, category and featured flag
-- ---------------------------------------------------------------------------
-- Added for the Phase 5C gallery editor. Nullable, so existing rows are valid
-- and the migration is safe to apply to a populated table.
-- ===========================================================================

alter table public.gallery_items
  add column if not exists photographer text,
  add column if not exists category     text,
  add column if not exists is_featured  boolean not null default false;

comment on column public.gallery_items.photographer is
  'Optional credit shown alongside the image.';
comment on column public.gallery_items.category is
  'Free-text grouping (e.g. "Workshops"). Free-text rather than an enum so
   volunteers can introduce a new grouping without a migration.';

-- Supports the public gallery query: featured + published, in display order.
create index if not exists gallery_items_featured_idx
  on public.gallery_items (status, is_featured, order_index);
