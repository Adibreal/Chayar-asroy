import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/types/database";

import { requireSupabaseConfig } from "./config";

/**
 * Supabase client for Server Components, Route Handlers and Server Actions.
 * Reads and refreshes the auth session through Next.js cookies.
 *
 * Acts as the signed-in user, so **RLS applies** — this is the client almost
 * all server code should use.
 *
 * Note: writing cookies from a Server Component throws; that is expected and
 * safely ignored here because `middleware.ts` refreshes the session on every
 * request.
 */
export async function createClient() {
  const { url, anonKey } = requireSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component — middleware handles cookie writes.
        }
      },
    },
  });
}
