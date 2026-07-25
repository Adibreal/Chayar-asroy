import { z } from "zod";

import { emailSchema, userRoleSchema } from "./common";

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
  /** Only same-origin paths, so `?next=` can't be used as an open redirect. */
  redirectTo: z
    .string()
    .startsWith("/", "Invalid redirect.")
    .refine((value) => !value.startsWith("//"), "Invalid redirect.")
    .optional(),
});

export const inviteUserSchema = z.object({
  email: emailSchema,
  fullName: z.string().trim().min(1, "Required.").max(120),
  role: userRoleSchema,
});

export const updateRoleSchema = z.object({
  userId: z.uuid(),
  role: userRoleSchema,
});

export type SignInInput = z.infer<typeof signInSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
