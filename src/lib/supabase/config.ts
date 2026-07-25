import { env } from "@/config/env";

/**
 * Supabase connection details, resolved once.
 *
 * The env vars are optional so the site builds and renders (from static
 * content) before a Supabase project exists. Anything that actually needs the
 * database calls `requireSupabaseConfig()` and fails loudly instead of silently
 * misbehaving.
 */
export function getSupabaseConfig() {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, anonKey, isConfigured: Boolean(url && anonKey) };
}

/** True when the app can talk to Supabase. Use to degrade gracefully. */
export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig().isConfigured;
}

export function requireSupabaseConfig(): { url: string; anonKey: string } {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see .env.example).",
    );
  }
  return { url, anonKey };
}
