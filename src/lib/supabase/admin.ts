import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { env } from "@/config/env";
import type { Database } from "@/types/database";

import { requireSupabaseConfig } from "./config";

/**
 * Privileged client using the service-role key. **Bypasses Row Level
 * Security entirely** — treat it like a root password.
 *
 * `server-only` makes importing this from a Client Component a build error.
 *
 * Use it only where RLS genuinely cannot express the rule, e.g.:
 *   - a super admin inviting a user
 *   - scheduled/maintenance jobs with no signed-in user
 *
 * Everything else must use `createClient()` from `./server` so policies apply.
 */
export function createAdminClient() {
  const { url } = requireSupabaseConfig();
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set — required for privileged operations.");
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
