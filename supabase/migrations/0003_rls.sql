-- ===========================================================================
-- 0003_rls.sql — Row Level Security and the child-safety publishing gate
-- ---------------------------------------------------------------------------
-- The database is the authority on permissions. UI checks are UX only.
--
-- Model:
--   anon           → may read PUBLISHED content only
--   editor         → may read everything and create/update content
--   admin          → editor + delete content and manage media
--   super_admin    → admin + manage people and roles
--
-- The `service_role` key bypasses RLS entirely and must never reach a browser.
-- ===========================================================================

alter table public.profiles          enable row level security;
alter table public.media             enable row level security;
alter table public.site_settings     enable row level security;
alter table public.navigation_items  enable row level security;
alter table public.social_links      enable row level security;
alter table public.pages             enable row level security;
alter table public.programs          enable row level security;
alter table public.gallery_albums    enable row level security;
alter table public.gallery_items     enable row level security;
alter table public.stories           enable row level security;
alter table public.testimonials      enable row level security;
alter table public.impact_stats      enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create policy "profiles: read own"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "profiles: admins read all"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

create policy "profiles: update own display fields"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Only super admins may create/deactivate people or change roles.
create policy "profiles: super admin manages"
  on public.profiles for all
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- Privileged profile columns may only be changed by a super admin. Enforced by
-- a trigger because an RLS policy cannot compare OLD and NEW values.
--
-- Covers `role` (privilege escalation) and `is_active` (a user must not be able
-- to reactivate a suspended account, nor lock themselves out).
create or replace function public.guard_profile_privileged_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_super_admin() then
    if new.role is distinct from old.role then
      raise exception 'Only a super admin may change a role';
    end if;
    if new.is_active is distinct from old.is_active then
      raise exception 'Only a super admin may activate or deactivate an account';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_guard_privileged_change
  before update on public.profiles
  for each row execute function public.guard_profile_privileged_change();

-- ---------------------------------------------------------------------------
-- Editorial content — one consistent pattern per table:
--   public reads published rows · editors read all and write · admins delete
-- ---------------------------------------------------------------------------

-- pages
create policy "pages: public reads published"
  on public.pages for select to anon, authenticated using (status = 'published');
create policy "pages: editors read all"
  on public.pages for select to authenticated using (public.can_edit());
create policy "pages: editors insert"
  on public.pages for insert to authenticated with check (public.can_edit());
create policy "pages: editors update"
  on public.pages for update to authenticated
  using (public.can_edit()) with check (public.can_edit());
create policy "pages: admins delete"
  on public.pages for delete to authenticated using (public.is_admin());

-- programs
create policy "programs: public reads published"
  on public.programs for select to anon, authenticated using (status = 'published');
create policy "programs: editors read all"
  on public.programs for select to authenticated using (public.can_edit());
create policy "programs: editors insert"
  on public.programs for insert to authenticated with check (public.can_edit());
create policy "programs: editors update"
  on public.programs for update to authenticated
  using (public.can_edit()) with check (public.can_edit());
create policy "programs: admins delete"
  on public.programs for delete to authenticated using (public.is_admin());

-- gallery_albums
create policy "gallery_albums: public reads published"
  on public.gallery_albums for select to anon, authenticated using (status = 'published');
create policy "gallery_albums: editors read all"
  on public.gallery_albums for select to authenticated using (public.can_edit());
create policy "gallery_albums: editors insert"
  on public.gallery_albums for insert to authenticated with check (public.can_edit());
create policy "gallery_albums: editors update"
  on public.gallery_albums for update to authenticated
  using (public.can_edit()) with check (public.can_edit());
create policy "gallery_albums: admins delete"
  on public.gallery_albums for delete to authenticated using (public.is_admin());

-- gallery_items
create policy "gallery_items: public reads published"
  on public.gallery_items for select to anon, authenticated using (status = 'published');
create policy "gallery_items: editors read all"
  on public.gallery_items for select to authenticated using (public.can_edit());
create policy "gallery_items: editors insert"
  on public.gallery_items for insert to authenticated with check (public.can_edit());
create policy "gallery_items: editors update"
  on public.gallery_items for update to authenticated
  using (public.can_edit()) with check (public.can_edit());
create policy "gallery_items: admins delete"
  on public.gallery_items for delete to authenticated using (public.is_admin());

-- stories
create policy "stories: public reads published"
  on public.stories for select to anon, authenticated using (status = 'published');
create policy "stories: editors read all"
  on public.stories for select to authenticated using (public.can_edit());
create policy "stories: editors insert"
  on public.stories for insert to authenticated with check (public.can_edit());
create policy "stories: editors update"
  on public.stories for update to authenticated
  using (public.can_edit()) with check (public.can_edit());
create policy "stories: admins delete"
  on public.stories for delete to authenticated using (public.is_admin());

-- testimonials
create policy "testimonials: public reads published"
  on public.testimonials for select to anon, authenticated using (status = 'published');
create policy "testimonials: editors read all"
  on public.testimonials for select to authenticated using (public.can_edit());
create policy "testimonials: editors insert"
  on public.testimonials for insert to authenticated with check (public.can_edit());
create policy "testimonials: editors update"
  on public.testimonials for update to authenticated
  using (public.can_edit()) with check (public.can_edit());
create policy "testimonials: admins delete"
  on public.testimonials for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Configuration tables — visible to everyone (the site renders them),
-- writable by editors, with only visible/available rows exposed publicly.
-- ---------------------------------------------------------------------------

create policy "site_settings: public reads"
  on public.site_settings for select to anon, authenticated using (true);
create policy "site_settings: admins write"
  on public.site_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "navigation_items: public reads available"
  on public.navigation_items for select to anon, authenticated using (is_available);
create policy "navigation_items: editors read all"
  on public.navigation_items for select to authenticated using (public.can_edit());
create policy "navigation_items: admins write"
  on public.navigation_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "social_links: public reads visible"
  on public.social_links for select to anon, authenticated using (is_visible);
create policy "social_links: editors read all"
  on public.social_links for select to authenticated using (public.can_edit());
create policy "social_links: admins write"
  on public.social_links for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "impact_stats: public reads visible"
  on public.impact_stats for select to anon, authenticated using (is_visible);
create policy "impact_stats: editors read all"
  on public.impact_stats for select to authenticated using (public.can_edit());
create policy "impact_stats: editors write"
  on public.impact_stats for all to authenticated
  using (public.can_edit()) with check (public.can_edit());

-- ---------------------------------------------------------------------------
-- media — readable by all (files are served from a public bucket anyway),
-- writable by editors, deletable by admins.
-- ---------------------------------------------------------------------------

create policy "media: public reads"
  on public.media for select to anon, authenticated using (true);
create policy "media: editors insert"
  on public.media for insert to authenticated with check (public.can_edit());
create policy "media: editors update"
  on public.media for update to authenticated
  using (public.can_edit()) with check (public.can_edit());
create policy "media: admins delete"
  on public.media for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- CHILD-SAFETY GATE
--
-- A gallery item may only be published when its media has verified guardian
-- consent. This is a database guarantee, not a UI convention, so no future
-- editor or bug can publish a child's photo without consent.
-- ---------------------------------------------------------------------------

create or replace function public.require_consent_to_publish()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'published'
     and not exists (
       select 1 from public.media m
       where m.id = new.media_id and m.consent_verified
     )
  then
    raise exception
      'Cannot publish gallery item %: media lacks verified guardian consent',
      new.id;
  end if;
  return new;
end;
$$;

create trigger gallery_items_require_consent
  before insert or update on public.gallery_items
  for each row execute function public.require_consent_to_publish();
