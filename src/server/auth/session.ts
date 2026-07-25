import "server-only";

import { cache } from "react";

import { hasRole } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { errors } from "@/server/shared/errors";
import type { Profile, UserRole } from "@/types/database";

/**
 * The signed-in user's profile, or `null`.
 *
 * Wrapped in React `cache()` so multiple components in one render share a
 * single database round-trip. Always verifies the JWT via `getUser()`.
 */
export const getCurrentUser = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  // A deactivated account is treated as signed out everywhere.
  return profile?.is_active ? profile : null;
});

/** The current user, or throw `UNAUTHENTICATED`. */
export async function requireUser(): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user) throw errors.unauthenticated();
  return user;
}

export { hasRole };

/**
 * The current user if they meet `minimum`, else throw.
 *
 * Defence in depth: RLS is the real authority, but checking here produces a
 * clear error instead of a confusing empty result, and guards non-database
 * side effects (e.g. file uploads).
 */
export async function requireRole(minimum: UserRole): Promise<Profile> {
  const user = await requireUser();
  if (!hasRole(user.role, minimum)) throw errors.forbidden();
  return user;
}

/** Convenience guards mirroring the SQL helper functions. */
export const requireEditor = () => requireRole("editor");
export const requireAdmin = () => requireRole("admin");
export const requireSuperAdmin = () => requireRole("super_admin");
