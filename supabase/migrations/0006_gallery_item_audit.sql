-- ===========================================================================
-- 0006_gallery_item_audit.sql — updated_by audit column for gallery_items
-- ---------------------------------------------------------------------------
-- Every other editorial table (pages, programs, gallery_albums, stories,
-- site_settings) records who last changed the row. `gallery_items` was the one
-- exception — an oversight, not a decision.
--
-- It mattered because the shared Server Action factory (`createEntityActions`)
-- stamps `updated_by` on every create and update. Against `gallery_items` that
-- produced PostgREST error PGRST204 ("Could not find the 'updated_by' column"),
-- so **every save in the Gallery editor failed**. TypeScript could not catch it:
-- the payload is cast before it reaches the client.
--
-- Nullable, with `on delete set null`, exactly like the sibling tables: losing a
-- volunteer's account must never delete the content they worked on.
-- ===========================================================================

alter table public.gallery_items
  add column if not exists updated_by uuid
    references public.profiles (id) on delete set null;

comment on column public.gallery_items.updated_by is
  'Profile that last modified this row. Audit trail only — never a permission input.';
