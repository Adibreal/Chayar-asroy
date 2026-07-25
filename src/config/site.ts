import { env } from "@/config/env";

/**
 * Single source of truth for organisation + site metadata.
 * Content shown to users (mission copy, real contact details, socials) is
 * confirmed with Chayar Asroy before launch — placeholders are marked TODO.
 */
export const siteConfig = {
  name: "Chayar Asroy",
  nameBn: "ছায়ার আশ্রয়",

  /**
   * Official logo artwork (Bengali lockup) — the single source of truth for the
   * navbar branding.
   *
   * `<Logo>` auto-detects the format from the extension: `.svg` renders directly
   * (crisp, unoptimised) while raster formats go through `next/image`. Switching
   * to an official SVG later therefore needs **only this `src`** to change — no
   * component edits. `width`/`height` give the intrinsic aspect ratio (used by
   * the raster path); set the whole value to `undefined` to fall back to the
   * tree mark + Bengali wordmark.
   *
   * `logo-trimmed.png` is the supplied artwork with its transparent margin
   * cropped and downscaled for the web (see `public/branding/README.md`). The
   * 2.2 MB original is intentionally kept out of the repo.
   */
  logo: { src: "/branding/logo-trimmed.png", width: 900, height: 442 } as
    { src: string; width: number; height: number } | undefined,
  tagline: "Student-led creativity & care for children in Bangladesh",
  description:
    "Chayar Asroy is a student-led initiative supporting underprivileged children in Bangladesh through creativity, learning, and community.",
  url: env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",
  location: "Dhaka, Bangladesh",

  contactEmail: "chayarasroy@gmail.com",

  /**
   * Social profiles as an ordered list, so a new platform is added *here alone*:
   * `SocialLinks` maps each `platform` to its icon and `Footer` never changes.
   */
  socials: [
    {
      platform: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/chayar.asroy",
    },
    {
      platform: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/share/1avcTb4Ptr/",
    },
  ],

  /**
   * The ONE primary call-to-action — reused by the navbar, hero, and campaign
   * band so the org's current priority action has a single source of truth.
   * Change `label`/`href` for the current priority (Support our work, Donate
   * School Supplies, Become a Volunteer when recruiting…), or set
   * `enabled: false` to hide it everywhere between campaigns. Just config — no
   * recruitment-state logic — later editable from the CMS.
   */
  primaryCta: {
    label: "Support our work",
    // Points at the homepage's "How to help" section until the dedicated pages
    // exist (Phase 5) — a real destination rather than a 404.
    href: "#how-to-help",
    enabled: true,
  },

  /**
   * The current campaign shown in the homepage CTA band. Swap this to re-theme
   * the band (donation drive, winter campaign, recruitment…) — the layout is
   * unchanged and its button is the shared `primaryCta` above.
   */
  campaign: {
    eyebrow: "Join us",
    title: "Be the reason a child believes in tomorrow.",
    description:
      "Whether you give your time, your skills, or the supplies a child needs — every hand helps us reach further.",
  },

  /**
   * Primary navigation — the site's information architecture.
   *
   * `available: false` marks a route that isn't built yet: `NavLinks` filters
   * those out, so the header, mobile drawer and footer never advertise a page
   * that would 404. Flip the flag as each page ships in Phase 5.
   */
  nav: [
    { label: "Our Journey", href: "/our-journey", available: false },
    { label: "Programs", href: "/programs", available: false },
    { label: "Gallery", href: "/gallery", available: false },
    { label: "Stories", href: "/stories", available: false },
    { label: "Get Involved", href: "/get-involved", available: false },
    { label: "Contact", href: "/contact", available: false },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
export type NavItem = (typeof siteConfig.nav)[number];

/**
 * Whether a route in `siteConfig.nav` is built yet. Used to hide links to
 * pages that would 404 — flip the `available` flag in `nav` as each ships.
 */
export function isRouteAvailable(href: string): boolean {
  return siteConfig.nav.some((item) => item.href === href && item.available !== false);
}
