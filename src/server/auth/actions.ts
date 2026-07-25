"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { AppError } from "@/server/shared/errors";
import { attempt, type Result } from "@/server/shared/result";
import { signInSchema } from "@/validation/auth";

/**
 * Sign in with email + password.
 *
 * Returns a `Result` rather than throwing so the login form can render the
 * error inline. The message is deliberately generic — telling an attacker
 * whether an address exists is an account-enumeration leak.
 */
export async function signIn(input: unknown): Promise<Result<{ redirectTo: string }>> {
  return attempt(async () => {
    const parsed = signInSchema.safeParse(input);
    if (!parsed.success) {
      throw new AppError("VALIDATION", "Please check your details.", {
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      });
    }

    const { email, password, redirectTo } = parsed.data;
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw new AppError("UNAUTHENTICATED", "Incorrect email or password.", { cause: error });
    }

    revalidatePath("/", "layout");
    return { redirectTo: redirectTo ?? "/admin" };
  });
}

/** Sign out and return to the login screen. */
export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}
