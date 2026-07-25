import { z } from "zod";

import {
  contentStatusSchema,
  hrefSchema,
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
  body: optionalText(20000),
  coverMediaId: uuidSchema.optional(),
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
  heroEyebrow: optionalText(80),
  heroTitle: requiredText(120),
  heroDescription: optionalText(400),
  heroMediaId: uuidSchema.optional(),
  missionEyebrow: optionalText(80),
  missionTitle: optionalText(160),
  missionDescription: optionalText(600),
  metaTitle: optionalText(70),
  metaDescription: optionalText(160),
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
