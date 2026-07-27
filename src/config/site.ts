import { env } from "@/config/env";

/**
 * Infrastructure and repo-owned assets — **not content**.
 *
 * Since Phase 5D every editable thing the public site shows (name, tagline,
 * description, contact details, navigation, socials, the primary CTA, the
 * campaign band and all homepage copy) is read from the CMS through
 * `@/server/content`. What remains here is the handful of values a database
 * row cannot sensibly own:
 *
 *   · `url` / `locale` — deployment facts, supplied by the environment.
 *   · `logo` — artwork committed to the repo (see `public/branding/README.md`).
 *   · `fallback` — the bare brand identity, used **only** when Supabase is not
 *     configured at all, so a fresh clone or a secret-less CI build still
 *     renders a coherent shell instead of a blank page.
 *
 * `fallback` is a safety net, never a content source: when Supabase *is*
 * configured the CMS is authoritative, and a failed read is logged rather than
 * silently papered over.
 */
export const siteConfig = {
  url: env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",

  /**
   * Official logo artwork (Bengali lockup).
   *
   * `<Logo>` auto-detects the format from the extension: `.svg` renders
   * directly (crisp, unoptimised) while raster formats go through `next/image`.
   * Switching to an official SVG later therefore needs **only this `src`** to
   * change. Set the whole value to `undefined` to fall back to the tree mark +
   * Bengali wordmark.
   */
  logo: { src: "/branding/logo-trimmed.png", width: 900, height: 442 } as
    { src: string; width: number; height: number } | undefined,

  /** Last-resort identity. See the note above — not a content source. */
  fallback: {
    name: "Chayar Asroy",
    nameBn: "ছায়ার আশ্রয়",
    tagline: "Student-led creativity & care for children in Bangladesh",
    description:
      "Chayar Asroy is a student-led initiative supporting underprivileged children in Bangladesh through creativity, learning, and community.",
  },
} as const;

export type SiteConfig = typeof siteConfig;
