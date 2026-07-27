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
--
-- Guarded with `where not exists` on `href` rather than `on conflict`:
-- navigation_items has no unique constraint besides its generated `id`, so a
-- bare `on conflict do nothing` never matches anything and re-running this file
-- would insert a second copy of every row. Matching on href keeps it genuinely
-- idempotent, and re-adds an individual row if someone deletes one.
insert into public.navigation_items (label, href, order_index, is_available)
select v.label, v.href, v.order_index, v.is_available
from (
  values
    ('Our Journey',  '/our-journey',  1, false),
    ('Programs',     '/programs',     2, false),
    ('Gallery',      '/gallery',      3, false),
    ('Stories',      '/stories',      4, false),
    ('Get Involved', '/get-involved', 5, false),
    ('Contact',      '/contact',      6, false)
) as v (label, href, order_index, is_available)
where not exists (
  select 1 from public.navigation_items n where n.href = v.href
);

-- Social links ---------------------------------------------------------------
insert into public.social_links (platform, label, href, order_index, is_visible)
values
  ('instagram', 'Instagram', 'https://www.instagram.com/chayar.asroy', 1, true),
  ('facebook',  'Facebook',  'https://www.facebook.com/share/1avcTb4Ptr/', 2, true)
on conflict (platform) do nothing;

-- ===========================================================================
-- Homepage placeholder content (Phase 5D)
-- ---------------------------------------------------------------------------
-- Moved verbatim out of the retired `src/content/home.ts` so the public site
-- has something to render now that it reads from the CMS.
--
-- ⚠️ TODO(org): ALL OF THE BELOW IS PLACEHOLDER COPY. It is on-brand and safe
-- to show internally, but it was written by the build, not by Chayar Asroy.
-- Replacing it with real, confirmed copy — and real, evidenced impact figures —
-- is Phase 6 work. Nothing here should reach the public internet as-is.
-- ===========================================================================

-- Homepage copy. `content` is jsonb validated by `homepageSchema`, so the
-- section wording can change without a migration.
insert into public.pages (slug, title, status, content)
values (
  'home',
  'Homepage',
  'published',
  jsonb_build_object(
    'heroEyebrow', 'Student-led creativity & care',
    'heroTitle', 'Every child deserves a canvas.',
    'heroDescription', 'Chayar Asroy supports underprivileged children across Bangladesh through creativity, learning, and community — not just donations, but human connection.',
    'heroSecondaryCtaLabel', 'Explore our journey',
    'heroSecondaryCtaHref', '/our-journey',

    'missionEyebrow', 'About us',
    'missionTitle', 'We believe art changes lives.',
    'missionDescription', 'Chayar Asroy started with a simple idea: creativity is not a luxury, it''s a lifeline. We work with children through art, learning, and community — building confidence, never dependency.',
    'missionPillarOneTitle', 'Our mission',
    'missionPillarOneBody', 'Give every child access to creative expression, education, and community support.',
    'missionPillarTwoTitle', 'Our vision',
    'missionPillarTwoBody', 'A Bangladesh where no child''s potential is limited by circumstance.',

    'programsEyebrow', 'Featured programs',
    'programsTitle', 'Turning ideas into impact',
    'programsDescription', 'A few of the programs bringing creativity to children across Bangladesh.',

    'galleryEyebrow', 'Gallery',
    'galleryTitle', 'Moments that inspire us',

    'voicesQuote', 'Creativity is not a luxury. It''s a lifeline.',
    'voicesAuthor', 'Chayar Asroy',

    'impactEyebrow', 'Our impact',
    -- Asterisks mark the accented italic in the approved design.
    'impactTitle', 'Small hands, *steady* work.',
    'impactDescription', 'Numbers tell part of our story. The real impact lives in the children we meet, the communities we walk with, and the future we build together.',
    'impactQuote', 'We don''t just run programs. We build relationships that last.',
    'impactQuoteAttribution', 'A Chayar Asroy volunteer',

    'helpEyebrow', 'How to help',
    'helpTitle', 'Something you no longer need could mean everything to a child.',
    'helpDescription', 'We collect gently-used items and place them directly into children''s hands across Dhaka.',
    'helpMethods', E'Donate through our agents around Dhaka\nSend via Pathao Instant Delivery\nMessage our page for direct collection',
    'helpCtaLabel', 'Message us to donate',
    'helpCtaHref', 'https://www.instagram.com/chayar.asroy'
  )
)
on conflict (slug) do nothing;

-- Featured programs.
insert into public.programs (slug, title, category, summary, order_index, is_featured, status)
values
  ('creative-workshops', 'Creative Workshops', 'art',
   'Helping children discover confidence through painting and imagination.', 1, true, 'published'),
  ('learning-support', 'Learning Support', 'education',
   'After-school classes and resources that strengthen foundational learning.', 2, true, 'published'),
  ('community-art-events', 'Community Art Events', 'community',
   'Events that bring neighbourhoods together through shared creativity.', 3, true, 'published')
on conflict (slug) do nothing;

-- Testimonials. Attribution is first name + age only — the dignity-preserving
-- form for children. Real names and quotes must not ship without guardian
-- consent; these two are invented.
-- `status` is cast explicitly: inside a `values` subquery the literal infers as
-- `text`, which will not assign to the `content_status` enum column.
insert into public.testimonials (quote, author_name, author_meta, order_index, status)
select v.quote, v.author_name, v.author_meta, v.order_index, v.status::public.content_status
from (
  values
    ('Before joining the art class, I was shy. Now I love drawing and I believe in myself.',
     'Nusrat', 'Age 11', 1, 'published'),
    ('Chayar Asroy feels like home. Here, we learn, create, and grow together.',
     'Rafi', 'Age 13', 2, 'published')
) as v (quote, author_name, author_meta, order_index, status)
where not exists (
  select 1 from public.testimonials t where t.quote = v.quote
);

-- Impact figures.
--
-- ⚠️ TODO(org): 500 / 40 / 25 / 12 ARE INVENTED PLACEHOLDERS. Publishing
-- unevidenced impact numbers for a real nonprofit would mislead donors and
-- volunteers. Replace every value with a figure the organisation can evidence,
-- and delete any row it cannot — the ledger renders whatever it is given, and
-- renders nothing at all when the table is empty.
insert into public.impact_stats (label, value, suffix, icon, order_index, is_visible)
select v.label, v.value, v.suffix, v.icon, v.order_index, v.is_visible
from (
  values
    ('Children reached',   500, '+',        'children',  1, true),
    ('Student volunteers',  40, null::text, 'hands',     2, true),
    ('Workshops held',      25, null::text, 'workshop',  3, true),
    ('Communities',         12, null::text, 'community', 4, true)
) as v (label, value, suffix, icon, order_index, is_visible)
where not exists (
  select 1 from public.impact_stats s where s.label = v.label
);
