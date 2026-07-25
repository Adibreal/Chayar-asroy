import type { GalleryItemData } from "@/components/gallery";
import {
  DONATION_ITEMS,
  type ImageAsset,
  type Program,
  type Story,
  type Testimonial,
  VOLUNTEER_ROLES,
} from "@/types";

/**
 * Homepage content — structured, swappable data. Today it's authored here;
 * later phases can fetch the same shapes from Supabase without touching a
 * single section component. Every list may be empty, one, or many: the homepage
 * renders gracefully (or omits the section) in each case.
 *
 * NOTE: copy and imagery below are on-brand PLACEHOLDERS to be confirmed with
 * the organisation. Testimonials are intentionally anonymised (child
 * protection). Images are left undefined so the branded placeholders render.
 */

type Cta = { label: string; href: string };

export const hero = {
  eyebrow: "Student-led creativity & care",
  title: "Every child deserves a canvas.",
  description:
    "Chayar Asroy supports underprivileged children across Bangladesh through creativity, learning, and community — not just donations, but human connection.",
  // The hero's primary button is the shared `siteConfig.primaryCta`; only the
  // secondary "learn more" action is hero-specific.
  secondaryCta: { label: "Explore our journey", href: "/our-journey" } satisfies Cta,
  image: undefined as ImageAsset | undefined,
};

export const mission = {
  eyebrow: "About us",
  title: "We believe art changes lives.",
  description:
    "Chayar Asroy started with a simple idea: creativity is not a luxury, it's a lifeline. We work with children through art, learning, and community — building confidence, never dependency.",
  pillars: [
    {
      title: "Our mission",
      body: "Give every child access to creative expression, education, and community support.",
    },
    {
      title: "Our vision",
      body: "A Bangladesh where no child's potential is limited by circumstance.",
    },
  ],
};

export const featuredPrograms: Program[] = [
  {
    slug: "creative-workshops",
    title: "Creative Workshops",
    category: "art",
    summary: "Helping children discover confidence through painting and imagination.",
    order: 1,
  },
  {
    slug: "learning-support",
    title: "Learning Support",
    category: "education",
    summary: "After-school classes and resources that strengthen foundational learning.",
    order: 2,
  },
  {
    slug: "community-art-events",
    title: "Community Art Events",
    category: "community",
    summary: "Events that bring neighbourhoods together through shared creativity.",
    order: 3,
  },
];

/**
 * Impact figures shown in the homepage ledger.
 *
 * ⚠️ TODO(org): THESE NUMBERS ARE PLACEHOLDERS AND MUST BE REPLACED WITH REAL
 * FIGURES BEFORE LAUNCH. Publishing invented impact numbers for a real
 * nonprofit would be dishonest to donors and volunteers. Replace each `value`
 * (and delete any row you can't evidence) — the ledger renders whatever it is
 * given, and renders nothing at all when the list is empty.
 *
 * `description` is the one human sentence that gives the number meaning; it is
 * what keeps the section from reading like a dashboard.
 */
export const impactStats = [
  { value: 500, suffix: "+", label: "Children reached", icon: "children" as const },
  { value: 40, label: "Student volunteers", icon: "hands" as const },
  { value: 25, label: "Workshops held", icon: "workshop" as const },
  { value: 12, label: "Communities", icon: "community" as const },
];

export const impact = {
  eyebrow: "Our impact",
  description:
    "Numbers tell part of our story. The real impact lives in the children we meet, the communities we walk with, and the future we build together.",
  // TODO(org): confirm this is something a volunteer actually said.
  quote: "We don't just run programs. We build relationships that last.",
  quoteAttribution: "A Chayar Asroy volunteer",
};

export const featuredStories: Story[] = [
  {
    slug: "confidence-in-colour",
    title: "Finding confidence in colour",
    excerpt: "A shy child who found her voice through a paintbrush — and now leads her class.",
    publishedAt: "2026-05-01",
  },
  {
    slug: "a-place-like-home",
    title: "A place that feels like home",
    excerpt: "How a weekend workshop became a second family for children across Dhaka.",
    publishedAt: "2026-04-12",
  },
  {
    slug: "growing-together",
    title: "Growing together",
    excerpt: "Volunteers and children learning side by side, one story at a time.",
    publishedAt: "2026-03-20",
  },
];

export const galleryPreview: GalleryItemData[] = [
  "Painting Day",
  "Spring Workshop",
  "Victory Celebration",
  "Children Smiling",
  "Community Event",
  "Murals",
  "Story Time",
  "Art Fair",
].map((caption, i) => ({ id: `g-${i}`, caption, consentVerified: true }));

/**
 * Attribution uses first name + age only — the standard, dignity-preserving
 * form for children. Real names/quotes must not ship without guardian consent.
 */
export const testimonials: Testimonial[] = [
  {
    quote: "Before joining the art class, I was shy. Now I love drawing and I believe in myself.",
    name: "Nusrat",
    meta: "Age 11",
  },
  {
    quote: "Chayar Asroy feels like home. Here, we learn, create, and grow together.",
    name: "Rafi",
    meta: "Age 13",
  },
];

export const volunteerOpportunities = VOLUNTEER_ROLES.map((role) => ({
  ...role,
  description: "Share your skills and help more children learn, create, and grow.",
}));

export const howToHelp = {
  eyebrow: "How to help",
  title: "Something you no longer need could mean everything to a child.",
  description:
    "We collect gently-used items and place them directly into children's hands across Dhaka.",
  items: DONATION_ITEMS,
  methods: [
    "Donate through our agents around Dhaka",
    "Send via Pathao Instant Delivery",
    "Message our page for direct collection",
  ],
  // Until /get-involved exists (Phase 5), send people to the channel the org
  // actually collects through — its Instagram inbox.
  cta: {
    label: "Message us to donate",
    href: "https://www.instagram.com/chayar.asroy",
  } satisfies Cta,
};

// The homepage's final CTA band is the reusable <CampaignCTA>, driven by
// `siteConfig.campaign` + the shared `siteConfig.primaryCta`.
