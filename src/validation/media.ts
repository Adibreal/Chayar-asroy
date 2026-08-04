import { z } from "zod";

import { optionalText, uuidSchema } from "./common";

/** Formats the public site can render. Mirrors the bucket's allowed types. */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
] as const;

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB — matches the bucket limit

/** Logical destinations; maps to the top-level folder in the storage path. */
export const MEDIA_FOLDERS = ["hero", "gallery", "programs", "stories", "general"] as const;
export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

/**
 * Server-side validation of an uploaded file.
 *
 * The bucket enforces these limits too — this layer exists to fail early with
 * a helpful message rather than a raw storage error.
 */
export const uploadFileSchema = z.object({
  file: z
    .instanceof(File, { message: "Choose a file to upload." })
    .refine((file) => file.size > 0, "That file is empty.")
    .refine(
      (file) => file.size <= MAX_IMAGE_BYTES,
      `Images must be ${MAX_IMAGE_BYTES / 1024 / 1024} MB or smaller.`,
    )
    .refine(
      (file) => (ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type),
      "Use a JPEG, PNG, WebP, AVIF or SVG image.",
    ),
  folder: z.enum(MEDIA_FOLDERS).default("general"),
  altText: z.string().trim().max(300, "Keep alt text under 300 characters.").default(""),
  caption: optionalText(300),
});

export const updateMediaSchema = z.object({
  id: uuidSchema,
  /**
   * Required here, but not on upload: files arrive in batches through the
   * dropzone, and blocking that would push editors towards describing images
   * they haven't looked at. The details form is where an image gets described,
   * so it is the right gate — and the media grid already flags what is missing.
   */
  altText: z
    .string()
    .trim()
    .min(1, "Describe this image for people using a screen reader.")
    .max(300, "Keep alt text under 300 characters."),
  caption: optionalText(300),
  /** Guardian consent — gates publishing of identifiable children. */
  consentVerified: z.boolean(),
});

export type UploadFileInput = z.infer<typeof uploadFileSchema>;
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>;
