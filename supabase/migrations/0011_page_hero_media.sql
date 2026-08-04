-- 0011 · A page's hero image becomes a real relationship.
--
-- The homepage editor has always had a "Hero image" picker, but the chosen id
-- was written into `pages.content` (jsonb) as `heroMediaId`, while the public
-- site read `og_media_id`. The two never met, so the hero silently rendered its
-- placeholder no matter what an editor picked — and every save cleared
-- `og_media_id`, which belongs to social sharing.
--
-- This gives `pages` its own `hero_media_id`, matching `stories.hero_media_id`
-- and `programs.cover_media_id`: a real foreign key, embeddable by PostgREST,
-- with the same `on delete set null` so removing an image never destroys the
-- page around it.

alter table public.pages
  add column if not exists hero_media_id uuid references public.media (id) on delete set null;

comment on column public.pages.hero_media_id is
  'Hero image for the page. Distinct from og_media_id, which is the social-sharing card.';

-- Backfill from the jsonb key the editor used to write.
--
-- The id is compared as text against `media.id` rather than cast to uuid: a
-- hand-edited jsonb blob could hold anything, and a bad cast would abort the
-- whole migration. Joining on the text form both validates the value and
-- guarantees the target row still exists.
update public.pages p
set hero_media_id = m.id
from public.media m
where p.hero_media_id is null
  and m.id::text = p.content ->> 'heroMediaId';

-- Media relationships are columns, not jsonb. Drop the key so there is exactly
-- one place a page's hero image lives and the two can never disagree again.
update public.pages
set content = content - 'heroMediaId'
where content ? 'heroMediaId';
