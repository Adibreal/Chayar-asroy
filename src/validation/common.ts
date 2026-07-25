import { z } from "zod";

/**
 * Primitives shared by every schema, so rules like "what is a valid slug"
 * are defined exactly once.
 */

export const uuidSchema = z.uuid("Must be a valid ID.");

export const slugSchema = z
  .string()
  .min(1, "Required.")
  .max(96, "Too long.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only.");

export const emailSchema = z.email("Enter a valid email address.").max(254);

/** Trimmed, non-empty text with a sensible bound. */
export const requiredText = (max = 240) =>
  z.string().trim().min(1, "Required.").max(max, `Must be ${max} characters or fewer.`);

/** Optional text that normalises "" to undefined, so empty inputs clear a column. */
export const optionalText = (max = 2000) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer.`)
    .optional()
    .transform((value) => (value === "" ? undefined : value));

/** Accepts an internal path (`/about`, `#anchor`) or an absolute http(s) URL. */
export const hrefSchema = z
  .string()
  .trim()
  .min(1, "Required.")
  .refine(
    (value) => value.startsWith("/") || value.startsWith("#") || /^https?:\/\//i.test(value),
    "Must be a path (/example), an anchor (#example) or a full URL.",
  );

export const contentStatusSchema = z.enum(["draft", "published", "archived"]);
export const userRoleSchema = z.enum(["super_admin", "admin", "editor"]);
/**
 * `coerce` because a `<input type="number">` hands React Hook Form a *string*.
 * Without it every save with an order value fails validation.
 */
export const orderIndexSchema = z.coerce.number().int().min(0).max(9999);

/** Cursorless pagination shared by every admin table. */
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export type Pagination = z.infer<typeof paginationSchema>;
