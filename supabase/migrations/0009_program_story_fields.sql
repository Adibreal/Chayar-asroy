-- ===========================================================================
-- 0009_program_story_fields.sql — the fields a program needs to tell its story
-- ---------------------------------------------------------------------------
-- Programs previously carried only what a homepage card needs (title, summary,
-- cover, category). The dedicated programs pages tell the whole story, which
-- needs the facts of the event and its narrative.
--
-- Two deliberate choices:
--
--   * `objectives` and `volunteers` are `text[]`, not child tables. They are
--     short, ordered, program-owned lists that are never queried independently
--     — a table each would add joins and CMS surface for no gain.
--
--   * A program's gallery is `gallery_items.program_id`, reusing the existing
--     media library rather than a second image store. This inherits the
--     child-safety consent trigger for free: an image still cannot be published
--     without verified guardian consent, whichever page it appears on.
-- ===========================================================================

alter table public.programs
  -- When the program happened. `date`, not `timestamptz`: this is a calendar
  -- day the organisation reports, not an instant.
  add column if not exists event_date    date,
  add column if not exists location      text,
  -- Free text ("45 children, 8 volunteers") so the org can describe reach in
  -- its own words rather than being forced into counters it cannot evidence.
  add column if not exists participation text,
  add column if not exists activities    text,
  add column if not exists objectives    text[] not null default '{}',
  add column if not exists volunteers    text[] not null default '{}';

comment on column public.programs.participation is
  'Free-text reach, e.g. "45 children, 8 volunteers". Never invent figures.';
comment on column public.programs.objectives is
  'Ordered list of what the program set out to do. One entry per line in the CMS.';
comment on column public.programs.volunteers is
  'Ordered list of volunteer names/roles credited for this program.';

-- ---------------------------------------------------------------------------
-- Per-program galleries
-- ---------------------------------------------------------------------------

alter table public.gallery_items
  -- `set null`, matching every other media reference: retiring a program must
  -- never delete the photographs taken at it.
  add column if not exists program_id uuid
    references public.programs (id) on delete set null;

comment on column public.gallery_items.program_id is
  'Optional owning program. Drives the gallery on /programs/[slug].';

-- Supports the per-program gallery query: one program, published, in order.
create index if not exists gallery_items_program_idx
  on public.gallery_items (program_id, status, order_index);
