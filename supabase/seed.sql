-- ===========================================================================
-- seed.sql — initial data mirroring src/config/site.ts
-- ---------------------------------------------------------------------------
-- Idempotent: safe to run repeatedly. Run after the migrations.
-- ===========================================================================

-- Singleton settings row -----------------------------------------------------
insert into public.site_settings (
  org_name, org_name_bn, tagline, description,
  contact_email, location,
  primary_cta_label, primary_cta_href, primary_cta_enabled,
  campaign_eyebrow, campaign_title, campaign_description
)
values (
  'Chayar Asroy',
  'ছায়ার আশ্রয়',
  'Student-led creativity & care for children in Bangladesh',
  'Chayar Asroy is a student-led initiative supporting underprivileged children in Bangladesh through creativity, learning, and community.',
  'chayarasroy@gmail.com',
  'Dhaka, Bangladesh',
  'Support our work',
  '#how-to-help',
  true,
  'Join us',
  'Be the reason a child believes in tomorrow.',
  'Whether you give your time, your skills, or the supplies a child needs — every hand helps us reach further.'
)
on conflict (is_singleton) do nothing;

-- Navigation -----------------------------------------------------------------
-- `is_available = false` until each page ships; NavLinks hides unavailable ones.
insert into public.navigation_items (label, href, order_index, is_available)
values
  ('Our Journey',  '/our-journey',  1, false),
  ('Programs',     '/programs',     2, false),
  ('Gallery',      '/gallery',      3, false),
  ('Stories',      '/stories',      4, false),
  ('Get Involved', '/get-involved', 5, false),
  ('Contact',      '/contact',      6, false)
on conflict do nothing;

-- Social links ---------------------------------------------------------------
insert into public.social_links (platform, label, href, order_index, is_visible)
values
  ('instagram', 'Instagram', 'https://www.instagram.com/chayar.asroy', 1, true),
  ('facebook',  'Facebook',  'https://www.facebook.com/share/1avcTb4Ptr/', 2, true)
on conflict (platform) do nothing;
