"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "@/server/auth/actions";

/**
 * Email + password sign-in.
 *
 * Kept intentionally plain — no `useAdminForm` here, because that hook depends
 * on the toast provider which only exists inside the authenticated shell. A
 * single inline error is also the clearer pattern for a login screen.
 */
export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const result = await signIn({
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo,
      });

      if (result.ok) {
        router.replace(result.data.redirectTo);
        router.refresh();
        return;
      }

      setError(result.error.message);
      setFieldErrors(result.error.fieldErrors ?? {});
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-small text-danger"
        >
          {error}
        </p>
      ) : null}

      <Field label="Email" required error={fieldErrors.email?.[0]}>
        {(props) => (
          <Input
            {...props}
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            required
            placeholder="you@example.com"
          />
        )}
      </Field>

      <Field label="Password" required error={fieldErrors.password?.[0]}>
        {(props) => (
          <Input
            {...props}
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        )}
      </Field>

      <Button type="submit" loading={isPending} className="mt-1 w-full">
        Sign in
      </Button>
    </form>
  );
}
