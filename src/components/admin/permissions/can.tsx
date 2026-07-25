import type { ReactNode } from "react";

import { hasRole } from "@/lib/permissions";
import type { UserRole } from "@/types/database";

/**
 * Renders `children` only when the user's role is sufficient.
 *
 * **UX only.** Hiding a button is a courtesy, never a security boundary — the
 * database (RLS) and `requireRole()` in Server Actions remain the authority.
 * Never rely on this to protect data.
 *
 * @example
 * <Can role={role} minimum="admin"><Button>Delete</Button></Can>
 */
export function Can({
  role,
  minimum,
  fallback = null,
  children,
}: {
  role: UserRole | null | undefined;
  minimum: UserRole;
  /** Shown instead when not permitted — e.g. a disabled control or a hint. */
  fallback?: ReactNode;
  children: ReactNode;
}) {
  return hasRole(role, minimum) ? <>{children}</> : <>{fallback}</>;
}
