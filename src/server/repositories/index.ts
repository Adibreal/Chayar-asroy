import "server-only";

import { createRepository } from "@/server/db/repository";

/**
 * Entity repositories — the data-access surface for the whole application.
 *
 * Each is the generic repository bound to one table, so CRUD is inherited
 * rather than rewritten. Add entity-specific queries by wrapping one of these
 * in its own module (see `programs.ts` for the pattern) instead of scattering
 * `.from("…")` calls through the app.
 *
 * All of them use the user-scoped client, so **RLS always applies**.
 */
export const mediaRepository = createRepository("media");
export const siteSettingsRepository = createRepository("site_settings");
export const navigationRepository = createRepository("navigation_items");
export const socialLinksRepository = createRepository("social_links");
export const pagesRepository = createRepository("pages");
export const galleryAlbumsRepository = createRepository("gallery_albums");
export const galleryItemsRepository = createRepository("gallery_items");
export const storiesRepository = createRepository("stories");
export const testimonialsRepository = createRepository("testimonials");
export const impactStatsRepository = createRepository("impact_stats");
export const profilesRepository = createRepository("profiles");

/** Entities that add their own queries export from their own module. */
export { programsRepository } from "./programs";
