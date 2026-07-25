-- ===========================================================================
-- 0001_foundation.sql — extensions, enums, shared helpers, users & roles
-- ---------------------------------------------------------------------------
-- Conventions used by EVERY table in this schema:
--   * `id uuid primary key default gen_random_uuid()`
--   * `created_at` / `updated_at timestamptz not null default now()`
--   * `updated_at` maintained by the shared `set_updated_at()` trigger
--   * Row Level Security enabled (policies live in 0003_rls.sql)
-- ===========================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Enums. Adding a value later is a one-line `alter type ... add value`.
-- ---------------------------------------------------------------------------

-- Ordered from most to least privileged. `editor` is the day-to-day role for
-- student volunteers; `admin` manages content + media; `super_admin` also
-- manages people and roles.
create type public.user_role as enum ('super_admin', 'admin', 'editor');

-- Every piece of editorial content shares one lifecycle.
create type public.content_status as enum ('draft', 'published', 'archived');

-- Mirrors the programme categories used by the public site.
create type public.program_category as enum ('art', 'education', 'community');

-- ---------------------------------------------------------------------------
-- Shared triggers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at is
  'Trigger function: keeps updated_at accurate on every UPDATE.';

-- ---------------------------------------------------------------------------
-- profiles — application-level user record, 1:1 with auth.users
--
-- Supabase owns `auth.users`; role and display data live here so they can be
-- referenced by foreign keys and read by RLS policies.
-- ---------------------------------------------------------------------------

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  role        public.user_role not null default 'editor',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is
  'Application user profile + role. One row per auth.users row.';

create index profiles_role_idx on public.profiles (role);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create the profile automatically whenever an auth user is created, so the
-- app never has to handle a signed-in user with no profile row.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Authorization helpers used by RLS policies.
--
-- SECURITY DEFINER so reading `profiles` inside a `profiles` policy cannot
-- recurse. `search_path` is pinned — a SECURITY DEFINER function without it is
-- a privilege-escalation risk.
-- ---------------------------------------------------------------------------

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = (select auth.uid())
    and is_active
$$;

comment on function public.current_user_role is
  'Role of the requesting user, or NULL when signed out/deactivated.';

-- Editor and above: may create and edit content.
create or replace function public.can_edit()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('super_admin', 'admin', 'editor')
$$;

-- Admin and above: may delete content and manage media.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('super_admin', 'admin')
$$;

-- Super admin only: may manage people and roles.
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'super_admin'
$$;
