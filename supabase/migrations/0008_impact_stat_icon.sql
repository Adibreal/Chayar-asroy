-- ===========================================================================
-- 0008_impact_stat_icon.sql — icon name for impact statistics
-- ---------------------------------------------------------------------------
-- Surfaced by Phase 5D: the homepage impact ledger renders an illustrated icon
-- beside each figure, but `impact_stats` had nowhere to record which one. The
-- values lived only in `src/content/home.ts`, so moving the section to the CMS
-- would have silently dropped the icons and changed an approved design.
--
-- Free text rather than an enum, matching the precedent set by
-- `gallery_items.category` in 0005: the app maps the name to a glyph through a
-- registry (`impact-icons.tsx`) and simply omits the icon if the name is not
-- recognised, so adding an icon is a code change and never a migration.
--
-- Recognised today: children · hands · workshop · community
-- ===========================================================================

alter table public.impact_stats
  add column if not exists icon text;

comment on column public.impact_stats.icon is
  'Optional icon name resolved by the app''s icon registry (children, hands, workshop, community). Unknown values render without an icon.';
