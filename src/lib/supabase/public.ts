import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

import { getSupabaseConfig } from "./config";

/**
 * Anonymous, cookie-less Supabase client for **public page content**.
 *
 * Deliberately not the `createClient()` in `server.ts`: that one reads
 * `cookies()`, which opts the route out of static rendering. The public site
 * shows the same published content to everyone, so it must not depend on the
 * request — this client lets `/` stay statically generated and be refreshed by
 * the `revalidatePath()` calls the CMS actions already make.
 *
 * Returns `null` when Supabase is not configured, so the site still builds and
 * renders (with empty sections) before a project exists — the behaviour
 * `README.md` promises. Callers must handle `null`.
 *
 * Anonymous means **RLS applies**: only published rows are readable. Public
 * queries still filter on status explicitly so the output never depends on who
 * happens to be signed in.
 */
export function createPublicClient() {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured || !url || !anonKey) return null;

  return createSupabaseClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
