import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

import { requireSupabaseConfig } from "./config";

/**
 * Supabase client for Client Components (browser).
 *
 * Uses the public anon key, which is safe to expose — every table is protected
 * by Row Level Security (see `supabase/migrations/0003_rls.sql`).
 */
export function createClient() {
  const { url, anonKey } = requireSupabaseConfig();
  return createBrowserClient<Database>(url, anonKey);
}
