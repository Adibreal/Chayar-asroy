-- ===========================================================================
-- 0004_storage.sql — storage buckets and their access policies
-- ---------------------------------------------------------------------------
-- Two buckets, deliberately:
--   media      public read  — every image the website renders
--   documents  private      — internal files (consent forms, reports)
--
-- Path convention (enforced by the app's storage layer, see
-- `src/server/storage/`):  <folder>/<yyyy>/<mm>/<uuid>.<ext>
-- where <folder> is one of: hero | gallery | programs | stories | general
-- ===========================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'media',
    'media',
    true,
    10485760, -- 10 MB
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
  ),
  (
    'documents',
    'documents',
    false,
    20971520, -- 20 MB
    array['application/pdf']
  )
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- media bucket
-- ---------------------------------------------------------------------------

create policy "media: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "media: editors upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.can_edit());

create policy "media: editors update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.can_edit())
  with check (bucket_id = 'media' and public.can_edit());

create policy "media: admins delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------------------------
-- documents bucket — never public
-- ---------------------------------------------------------------------------

create policy "documents: editors read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'documents' and public.can_edit());

create policy "documents: editors upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'documents' and public.can_edit());

create policy "documents: admins delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'documents' and public.is_admin());
