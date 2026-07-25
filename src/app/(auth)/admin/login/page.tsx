import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { TreeMark } from "@/components/brand/logo";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/server/auth/session";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  // `absolute` so the public site's title template isn't appended as well.
  title: { absolute: "Sign in · Chayar Asroy CMS" },
  robots: { index: false, follow: false },
};

/**
 * CMS sign-in.
 *
 * Deliberately lives in the `(auth)` route group, *not* under `(admin)/admin`,
 * so it doesn't inherit the protected layout — otherwise reaching the login
 * page would redirect to the login page forever.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  if (isSupabaseConfigured()) {
    const user = await getCurrentUser();
    if (user) redirect(next ?? "/admin");
  }

  return (
    <main className="admin grid min-h-dvh place-items-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <TreeMark className="size-10" />
          <div>
            <h1 className="text-h4 font-semibold">Chayar Asroy CMS</h1>
            <p className="mt-1 text-small text-muted-foreground">Sign in to manage the website.</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <LoginForm redirectTo={next} />
        </div>
      </div>
    </main>
  );
}
