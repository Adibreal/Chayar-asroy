import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

/** Routes below this prefix require an authenticated user. */
const ADMIN_PREFIX = "/admin";
/** Where unauthenticated users are sent, and where signed-in users skip past. */
const LOGIN_PATH = "/admin/login";

/**
 * Runs on every matched request to:
 *   1. refresh the Supabase session (keeps cookies alive), and
 *   2. gate the admin area.
 *
 * This is a coarse gate for UX — it only checks *authentication*. Real
 * authorization is enforced by RLS in the database and re-checked in Server
 * Actions via `requireRole()`.
 */
export async function middleware(request: NextRequest) {
  const { response, user, isConfigured } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // With no backend there is no session to gate on. Let the request through so
  // the admin layout can explain what's missing, instead of bouncing the user
  // to a login form that cannot possibly work.
  if (!isConfigured) return response;

  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isLoginRoute = pathname === LOGIN_PATH;

  if (isAdminRoute && !isLoginRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = LOGIN_PATH;
    // Preserve the destination so login can return the user to it.
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginRoute && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ADMIN_PREFIX;
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  /**
   * The CMS only. The public site is static and the same for everyone — no
   * public page reads the session — so running this on every visitor's
   * request (as it used to) bought nothing but latency and an auth call per
   * page view. The login page and the CMS's Server Actions all live under
   * `/admin`, so sessions are still refreshed everywhere they are used.
   * `:path*` also matches `/admin` itself.
   */
  matcher: ["/admin/:path*"],
};
