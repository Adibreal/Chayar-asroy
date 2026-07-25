import type { UserRole } from "@/types/database";

/**
 * Role logic shared by the server guards and the UI.
 *
 * Deliberately free of `server-only` so Client Components can import it — the
 * *rules* are shared, but only the server's `requireRole()` is a guarantee.
 * UI checks here exist to hide what a user cannot do; the database (RLS) is
 * always the authority.
 */

/** Privilege order — the index doubles as rank. */
const ROLE_RANK: Record<UserRole, number> = {
  editor: 1,
  admin: 2,
  super_admin: 3,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  editor: "Editor",
  admin: "Admin",
  super_admin: "Super admin",
};

/** True when `role` meets or exceeds `minimum`. */
export function hasRole(role: UserRole | null | undefined, minimum: UserRole): boolean {
  if (!role) return false;
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export const canEdit = (role: UserRole | null | undefined) => hasRole(role, "editor");
export const canDelete = (role: UserRole | null | undefined) => hasRole(role, "admin");
export const canManageUsers = (role: UserRole | null | undefined) => hasRole(role, "super_admin");
