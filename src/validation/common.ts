import { z } from "zod";

import { toLines } from "@/lib/utils";

/**
 * Primitives shared by every schema, so rules like "what is a valid slug"
 * are defined exactly once.
 */

export const uuidSchema = z.uuid("Must be a valid ID.");

/**
 * A link to another row — an image, a programme — that an editor can remove.
 *
 * `null` means "removed" and clears the column; `undefined` means "not part of
 * this submission" and leaves it alone. Forms must send `null` to clear: a
 * Server Action drops object keys whose value is `undefined` in transit, so an
 * `undefined` never reaches the server at all.
 */
export const nullableIdSchema = uuidSchema.nullish();

export const slugSchema = z
  .string()
  .min(1, "Required.")
  .max(96, "Too long.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only.");

export const emailSchema = z.email("Enter a valid email address.").max(254);

/** Trimmed, non-empty text with a sensible bound. */
export const requiredText = (max = 240) =>
  z.string().trim().min(1, "Required.").max(max, `Must be ${max} characters or fewer.`);

/**
 * Optional text that normalises "" to undefined. On an update, `toRowPayload`
 * turns a field that was submitted empty into `null`, so the column is cleared.
 */
export const optionalText = (max = 2000) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer.`)
    .optional()
    .transform((value) => (value === "" ? undefined : value));

/**
 * An optional `YYYY-MM-DD` date. A cleared `<input type="date">` submits "",
 * which a bare `z.iso.date()` rejects — so emptying the field used to fail
 * validation instead of removing the date.
 */
export const optionalDate = () =>
  z
    .union([z.iso.date("Enter a valid date."), z.literal("")])
    .optional()
    .transform((value) => (value === "" ? undefined : value));

/**
 * A short ordered list, edited as one item per line.
 *
 * Parses to `string[]`, which is what the `text[]` columns behind objectives
 * and volunteer credits expect — so the form stays a plain textarea while the
 * database keeps a real array.
 */
export const linesSchema = (max = 2000) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer.`)
    .optional()
    .transform((value) => toLines(value));

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
