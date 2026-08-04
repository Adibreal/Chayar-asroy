-- ===========================================================================
-- 0010_campaign_background.sql — background photograph for the campaign band
-- ---------------------------------------------------------------------------
-- The "Support our work" band was a flat cobalt field. Giving it a photograph
-- of the organisation's actual work makes the closing ask feel like a moment
-- rather than a coloured box.
--
-- A reference into the existing media library, exactly like every other image
-- on the site — no second image store, and `on delete set null` so removing a
-- photograph never destroys the settings row around it. When it is null the app
-- falls back to a heavily blurred brand placeholder, so the band always has a
-- background and never regresses to a flat fill.
-- ===========================================================================

alter table public.site_settings
  add column if not exists campaign_media_id uuid
    references public.media (id) on delete set null;

comment on column public.site_settings.campaign_media_id is
  'Background photograph for the campaign CTA band. Heavily blurred behind a dark gradient, so composition matters far less than warmth and colour.';
