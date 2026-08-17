import { z } from "zod";

import {
  contentStatusSchema,
  hrefSchema,
  linesSchema,
  optionalText,
  orderIndexSchema,
  requiredText,
  slugSchema,
  uuidSchema,
} from "./common";

/**
 * Write schemas for every editorial entity — the contract for Server Actions
 * and, through them, for database writes.
 *
 * Each entity exports a `create` schema and derives `update` from it, so the
 * two can never drift apart.
 */

export const programSchema = z.object({
  slug: slugSchema,
  title: requiredText(120),
  category: z.enum(["art", "education", "community"]),
  summary: requiredText(300),
  /** The overview — the full story of the programme. */
  body: optionalText(20000),
  /** What actually happened on the day, told as its own passage. */
  activities: optionalText(20000),
  coverMediaId: uuidSchema.optional(),

  // Facts of the event, shown beneath the title on the programme page.
  eventDate: z.iso.date().optional(),
  location: optionalText(120),
  /** Free text — "45 children, 8 volunteers". Never an invented number. */
  participation: optionalText(120),

  // Short ordered lists, collected one-per-line (see `toLines`).
  objectives: linesSchema(2000),
  volunteers: linesSchema(2000),

  orderIndex: orderIndexSchema.default(0),
  isFeatured: z.boolean().default(false),
  status: contentStatusSchema.default("draft"),
  metaTitle: optionalText(70),
  metaDescription: optionalText(160),
});

export const storySchema = z.object({
  slug: slugSchema,
  title: requiredText(160),
  excerpt: requiredText(300),
  body: optionalText(40000),
  heroMediaId: uuidSchema.optional(),
  authorName: optionalText(120),
  orderIndex: orderIndexSchema.default(0),
  isFeatured: z.boolean().default(false),
  status: contentStatusSchema.default("draft"),
  metaTitle: optionalText(70),
  metaDescription: optionalText(160),
});

export const galleryAlbumSchema = z.object({
  slug: slugSchema,
  title: requiredText(120),
  description: optionalText(600),
  eventDate: z.iso.date().optional(),
  coverMediaId: uuidSchema.optional(),
  orderIndex: orderIndexSchema.default(0),
  status: contentStatusSchema.default("draft"),
});

export const galleryItemSchema = z.object({
  albumId: uuidSchema.optional(),
  /** Owning programme — drives the gallery on that programme's page. */
  programId: uuidSchema.optional(),
  mediaId: uuidSchema,
  caption: optionalText(300),
  photographer: optionalText(120),
  /** Free text so a new grouping never needs a migration. */
  category: optionalText(60),
  isFeatured: z.boolean().default(false),
  orderIndex: orderIndexSchema.default(0),
  status: contentStatusSchema.default("draft"),
});

export const testimonialSchema = z.object({
  quote: requiredText(600),
  // Deliberately minimal attribution (first name + age) to protect children.
  authorName: requiredText(80),
  authorMeta: optionalText(80),
  avatarMediaId: uuidSchema.optional(),
  orderIndex: orderIndexSchema.default(0),
  status: contentStatusSchema.default("draft"),
});

export const impactStatSchema = z.object({
  label: requiredText(80),
  // Coerced for the same reason as `orderIndexSchema` — number inputs are strings.
  value: z.coerce.number().int().min(0).max(1_000_000),
  // Rendered immediately before the value (`৳` on a money figure) and
  // immediately after it (`+` on a rounded count). Both short by design: they
  // are symbols, not words, and the number has to stay the thing you read.
  prefix: optionalText(8),
  suffix: optionalText(8),
  orderIndex: orderIndexSchema.default(0),
  isVisible: z.boolean().default(true),
});

export const navigationItemSchema = z.object({
  label: requiredText(60),
  href: hrefSchema,
  parentId: uuidSchema.optional(),
  orderIndex: orderIndexSchema.default(0),
  /** False hides routes that aren't built yet, so nothing 404s. */
  isAvailable: z.boolean().default(false),
});

export const socialLinkSchema = z.object({
  platform: z
    .string()
    .trim()
    .regex(/^[a-z][a-z0-9-]*$/, "Lowercase identifier, e.g. instagram."),
  label: requiredText(40),
  href: z.url("Enter a full URL."),
  orderIndex: orderIndexSchema.default(0),
  isVisible: z.boolean().default(true),
});

export const siteSettingsSchema = z.object({
  orgName: requiredText(120),
  orgNameBn: optionalText(120),
  tagline: optionalText(200),
  description: optionalText(600),
  contactEmail: z.email().optional().or(z.literal("")),
  contactPhone: optionalText(40),
  location: optionalText(120),
  logoMediaId: uuidSchema.optional(),
  primaryCtaLabel: optionalText(60),
  primaryCtaHref: hrefSchema.optional(),
  primaryCtaEnabled: z.boolean().default(true),
  campaignEyebrow: optionalText(60),
  campaignTitle: optionalText(160),
  campaignDescription: optionalText(400),
  /** Background photograph for the campaign band; blurred behind a dark wash. */
  campaignMediaId: uuidSchema.optional(),
  defaultMetaTitle: optionalText(70),
  defaultMetaDescription: optionalText(160),
  defaultOgMediaId: uuidSchema.optional(),
});

/**
 * Homepage content.
 *
 * Stored in `pages.content` (jsonb) keyed by slug `home`, so the homepage's
 * shape can evolve without a migration. Zod is what keeps that jsonb honest.
 *
 * Which programs/gallery images appear is *not* here — that's the `is_featured`
 * flag on each item, edited where the item lives, so there is one source of
 * truth per piece of content.
 */
export const homepageSchema = z.object({
  // 1 · Hero
  heroEyebrow: optionalText(80),
  heroTitle: requiredText(120),
  heroDescription: optionalText(400),
  /**
   * Persisted to the `pages.hero_media_id` **column**, not into `content` —
   * `saveHomePage` lifts it out before the rest is spread into the jsonb. Media
   * relationships stay real foreign keys so PostgREST can embed them.
   */
  heroMediaId: uuidSchema.optional(),
  heroSecondaryCtaLabel: optionalText(40),
  heroSecondaryCtaHref: hrefSchema.optional(),

  // 2 · Mission. Exactly two pillars, matching the two-column design — flat
  // fields rather than an array so the editor stays a plain form.
  missionEyebrow: optionalText(80),
  missionTitle: optionalText(160),
  missionDescription: optionalText(600),
  missionPillarOneTitle: optionalText(80),
  missionPillarOneBody: optionalText(300),
  missionPillarTwoTitle: optionalText(80),
  missionPillarTwoBody: optionalText(300),

  // 3 · Featured programs — the section heading only. *Which* programs appear
  // is the `is_featured` flag on each program, edited where the program lives.
  programsEyebrow: optionalText(80),
  programsTitle: optionalText(160),
  programsDescription: optionalText(400),

  // 4 · Gallery preview heading.
  galleryEyebrow: optionalText(80),
  galleryTitle: optionalText(160),

  // 5 · Voices — the pull quote above the testimonials.
  voicesQuote: optionalText(300),
  voicesAuthor: optionalText(80),

  // 5.5 · Impact. `impactTitle` supports *emphasis* between asterisks, which
  // renders as the brand's accented italic — that flourish is part of the
  // approved design, so editors keep control of it without needing HTML.
  impactEyebrow: optionalText(80),
  impactTitle: optionalText(160),
  impactDescription: optionalText(600),
  impactQuote: optionalText(300),
  impactQuoteAttribution: optionalText(80),

  // 6 · How to help. One collection method per line.
  helpEyebrow: optionalText(80),
  helpTitle: optionalText(160),
  helpDescription: optionalText(600),
  helpMethods: optionalText(600),
  helpCtaLabel: optionalText(40),
  helpCtaHref: hrefSchema.optional(),

  // SEO
  metaTitle: optionalText(70),
  metaDescription: optionalText(160),
  /**
   * The social-sharing card — a different image from the hero, for a different
   * surface. **No field in the homepage editor submits this today**, so
   * `saveHomePage` deliberately leaves `og_media_id` untouched when it is
   * absent rather than writing `null` over whatever is there.
   */
  ogMediaId: uuidSchema.optional(),
});

export type HomepageInput = z.infer<typeof homepageSchema>;

/** `update` variants: same rules, all fields optional, plus the target id. */
export const programUpdateSchema = programSchema.partial().extend({ id: uuidSchema });
export const storyUpdateSchema = storySchema.partial().extend({ id: uuidSchema });
export const galleryAlbumUpdateSchema = galleryAlbumSchema.partial().extend({ id: uuidSchema });
export const galleryItemUpdateSchema = galleryItemSchema.partial().extend({ id: uuidSchema });
export const testimonialUpdateSchema = testimonialSchema.partial().extend({ id: uuidSchema });

export type ProgramInput = z.infer<typeof programSchema>;
export type StoryInput = z.infer<typeof storySchema>;
export type GalleryAlbumInput = z.infer<typeof galleryAlbumSchema>;
export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
