import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/types/database";

import { getSupabaseConfig } from "./config";

/**
 * Refreshes the Supabase auth session on every matched request and reports who
 * the user is, so `middleware.ts` can gate protected routes.
 *
 * Cookies must be written to the *same* response object that is ultimately
 * returned, otherwise the refreshed session is lost — hence the response is
 * created up front and handed back to the caller.
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  const { url, anonKey, isConfigured } = getSupabaseConfig();

  // Without Supabase configured there is no session to refresh; the site still
  // serves its static content.
  if (!isConfigured || !url || !anonKey) {
    return { response, user: null, isConfigured: false as const };
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // `getUser()` (not `getSession()`) revalidates the JWT with the auth server —
  // session data from cookies alone must never be trusted for authorization.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user, isConfigured: true as const };
}
