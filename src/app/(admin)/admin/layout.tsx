import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/layout";
import { ToastProvider } from "@/components/admin/feedback";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/server/auth/session";

/** The CMS must never be indexed. */
export const metadata: Metadata = {
  title: { default: "CMS", template: "%s · Chayar Asroy CMS" },
  robots: { index: false, follow: false },
};

/**
 * Every CMS page is per-user and session-dependent, so nothing here may be
 * prerendered or cached at build time. Applies to all nested segments.
 */
export const dynamic = "force-dynamic";

/**
 * Protected layout for every `/admin` page except login (which has its own
 * route group segment and renders outside the shell).
 *
 * Auth is checked here as well as in middleware — belt and braces. Middleware
 * can be bypassed by direct RSC requests in some edge cases, so the layout is
 * the real gate, and RLS is the final one.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <SetupRequired />;
  }

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <ToastProvider>
      <AdminShell user={user}>{children}</AdminShell>
    </ToastProvider>
  );
}

/**
 * Shown when Supabase isn't configured yet, instead of a stack trace — the CMS
 * is the one part of the site that genuinely requires a backend.
 */
function SetupRequired() {
  return (
    <div className="admin grid min-h-dvh place-items-center bg-background px-6 text-foreground">
      <div className="max-w-md space-y-3 text-center">
        <h1 className="text-h4 font-semibold">CMS not configured</h1>
        <p className="text-small text-muted-foreground">
          Set <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in
          <code className="ml-1 rounded bg-muted px-1 py-0.5">.env.local</code>, then run the
          migrations.
        </p>
        <p className="text-caption text-muted-foreground">
          Full instructions are in <code>docs/BACKEND.md</code>.
        </p>
      </div>
    </div>
  );
}
