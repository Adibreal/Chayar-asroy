/**
 * Content domain types.
 *
 * These describe the *shape* of the organisation's content so that pages,
 * structured content (Phase 2 feature work) and the Supabase schema (Phase 3)
 * all agree on one model. No real content lives here.
 */

/** Programs Chayar Asroy runs. */
export interface Program {
  slug: string;
  title: string;
  category: "art" | "education" | "community";
  summary: string;
  body?: string;
  coverImage?: ImageAsset;
  order: number;
}

/** A published story / testimonial. */
export interface Story {
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  heroImage?: ImageAsset;
  author?: string;
  publishedAt: string; // ISO date
}

/** A single gallery photograph. */
export interface GalleryItem {
  id: string;
  image: ImageAsset;
  caption?: string;
  albumSlug?: string;
  /**
   * Publishing photos of identifiable children requires guardian consent.
   * Nothing renders publicly unless this is `true`.
   */
  consentVerified: boolean;
}

export interface GalleryAlbum {
  slug: string;
  title: string;
  eventDate?: string; // ISO date
  cover?: ImageAsset;
}

/** A published testimonial / short quote from a child, family, or volunteer. */
export interface Testimonial {
  quote: string;
  name: string;
  /** Secondary attribution, e.g. age or role. */
  meta?: string;
  avatar?: ImageAsset;
}

export interface TeamMember {
  name: string;
  role: string;
  photo?: ImageAsset;
  bio?: string;
  order: number;
}

export interface ImpactStat {
  label: string;
  value: string;
  order: number;
}

export interface ImageAsset {
  src: string;
  /** Required for accessibility — every image must describe itself. */
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
}

/**
 * Volunteer roles, mirroring the organisation's real recruitment poster.
 * Used by the volunteer form's "area of interest" field (Phase 3).
 */
export const VOLUNTEER_ROLES = [
  { value: "graphic-designer", label: "Graphic Designer" },
  { value: "content-writer", label: "Content Writer" },
  { value: "planning-logistics", label: "Planning & Logistics" },
  { value: "media-documentation", label: "Media & Documentation" },
] as const;

export type VolunteerRole = (typeof VOLUNTEER_ROLES)[number]["value"];

/**
 * In-kind donation categories, mirroring the organisation's real "how to help"
 * campaign. Chayar Asroy currently collects items (not money).
 */
export const DONATION_ITEMS = [
  { value: "books-notebooks", label: "Books & Notebooks" },
  { value: "clothes-toys", label: "Clothes & Toys" },
  { value: "crayons-colours", label: "Crayons & Colours" },
] as const;

export type DonationItem = (typeof DONATION_ITEMS)[number]["value"];
