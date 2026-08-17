-- ===========================================================================
-- 0012_impact_stat_prefix.sql — leading symbol for impact statistics
-- ---------------------------------------------------------------------------
-- `impact_stats` could already append a unit (`suffix`, added with the table in
-- 0002) but never prepend one. That was fine while every figure was a bare
-- count — 80 children, 20 volunteers, 4 programmes — and became a gap the
-- moment a monetary figure was added: a taka amount reads `৳45,000`, with the
-- symbol *before* the digits.
--
-- A column rather than a code-level convention, for the same reason
-- `pages.hero_media_id` is a column: the alternative was inferring the symbol
-- from the icon name or the label, which hides a displayed value inside a
-- lookup no editor can see or change. `ImpactEntry.prefix` has existed in the
-- component layer since the section was built, so this migration closes the
-- gap between what the design supports and what the database can express —
-- it does not invent a new capability.
--
-- Nullable and additive: every existing row keeps its exact rendering, because
-- a null prefix renders nothing at all.
--
-- Also refreshes the `icon` comment from 0008, which enumerated the four names
-- the registry knew at the time. The registry now also recognises `money` and
-- `donation` (`src/components/impact/impact-icons.tsx`).
-- ===========================================================================

alter table public.impact_stats
  add column if not exists prefix text;

comment on column public.impact_stats.prefix is
  'Optional symbol rendered immediately before the value (e.g. ''৳'' for a taka amount). Null renders nothing.';

comment on column public.impact_stats.icon is
  'Optional icon name resolved by the app''s icon registry (children, hands, workshop, community, money, donation). Unknown values render without an icon.';
