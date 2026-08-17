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
  '/#how-to-help',
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

-- Programmes.
--
-- ⚠️ TODO(org): placeholder programmes. The story fields below exist to show
-- the shape of a complete programme page — replace all of it, including the
-- dates, locations and participation figures, with real records. Delete any
-- programme the organisation did not actually run.
insert into public.programs (
  slug, title, category, summary, body, activities,
  event_date, location, participation, objectives, volunteers,
  order_index, is_featured, status
)
values
  ('creative-workshops', 'Creative Workshops', 'art',
   'Helping children discover confidence through painting and imagination.',
   E'A room, a stack of paper, and more colour than anyone knew what to do with.\n\nThe workshop began quietly. Within an hour it was the loudest room in the building — which is exactly what we hoped for.',
   E'Children worked in small groups with a volunteer each, moving between painting, collage and free drawing.\n\nEvery child took their work home, and a few insisted on making a second one for a sibling.',
   '2026-03-14', 'Mirpur, Dhaka', '45 children, 8 volunteers',
   array[
     'Give every child unhurried access to art materials',
     'Build confidence through finished, take-home work',
     'Give volunteers a first, low-pressure session to learn from'
   ],
   array['Nusrat Jahan', 'Rafiul Islam', 'Tanvir Ahmed'],
   1, true, 'published'),

  ('learning-support', 'Learning Support', 'education',
   'After-school classes and resources that strengthen foundational learning.',
   E'Reading and arithmetic, taught at the pace of the child in front of you rather than the syllabus.',
   E'Two hours after school, twice a week, in groups small enough that nobody could hide at the back.',
   '2026-04-22', 'Mohammadpur, Dhaka', '30 children, 6 volunteers',
   array['Strengthen reading and number confidence', 'Keep attendance steady across the term'],
   array['Sadia Rahman', 'Imran Hossain'],
   2, true, 'published'),

  ('community-art-events', 'Community Art Events', 'community',
   'Events that bring neighbourhoods together through shared creativity.',
   E'An open day where the art belonged to the whole street, not just the children who made it.',
   E'A shared mural, a display of the term''s work, and tea for anyone who stopped to look.',
   '2026-05-30', 'Dhanmondi, Dhaka', '120 attendees, 12 volunteers',
   array['Show the children''s work to their own community', 'Invite new families to join'],
   array['Mahmudul Hasan', 'Farhana Akter', 'Zahid Khan'],
   3, true, 'published')
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
-- These are the organisation's REAL, supplied figures — no longer placeholders.
-- They are exact counts, so no `+` suffix: a trailing plus would claim more than
-- the organisation stated.
--
-- Keep them current, and never add a row the organisation cannot evidence. A
-- fourth "Communities" figure was carried here while the data was invented; it
-- was removed rather than guessed at. The ledger renders whatever it is given,
-- and renders nothing at all when the table is empty, so dropping a metric you
-- cannot back up is always safe.
--
-- `Money raised` stores a bare integer and wears its symbol as a `prefix`
-- (migration 0012). The amount is NOT scaled — 24500 is ৳24,500, not paisa —
-- and the thousands separator is applied at render time by `AnimatedCounter`,
-- so the column holds the number and nothing else.
--
-- Five is the ledger's widest supported row. A sixth figure still renders, but
-- it wraps to a second row rather than shrinking the first.
insert into public.impact_stats (label, value, prefix, suffix, icon, order_index, is_visible)
select v.label, v.value, v.prefix, v.suffix, v.icon, v.order_index, v.is_visible
from (
  values
    ('Children reached',    80, null::text, null::text, 'children', 1, true),
    ('Volunteers',          20, null::text, null::text, 'hands',    2, true),
    ('Programs held',        4, null::text, null::text, 'workshop', 3, true),
    ('Money raised',     24500, '৳',        null::text, 'money',    4, true),
    ('Donations received',  37, null::text, null::text, 'donation', 5, true)
) as v (label, value, prefix, suffix, icon, order_index, is_visible)
where not exists (
  select 1 from public.impact_stats s where s.label = v.label
);
