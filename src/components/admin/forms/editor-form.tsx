"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { FieldValues } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import type { Result } from "@/server/shared/result";

import { Form } from "./form";
import { useAdminForm } from "./use-admin-form";

/**
 * The standard editor page: a form with a sticky save bar.
 *
 * Every content editor uses it, so saving, cancelling, dirty-state and
 * post-save navigation behave identically. Editors supply only their fields.
 *
 * The save button stays disabled until something changes, which quietly
 * communicates "nothing to save" instead of letting people submit no-ops.
 */
export function EditorForm<TValues extends FieldValues, TResult>({
  schema,
  defaultValues,
  action,
  successMessage,
  redirectTo,
  submitLabel = "Save",
  secondaryActions,
  children,
}: {
  schema: z.ZodType;
  defaultValues?: Parameters<typeof useAdminForm<TValues, TResult>>[0]["defaultValues"];
  action: (input: unknown) => Promise<Result<TResult>>;
  successMessage?: string;
  /** Where to go after a successful save — omit to stay on the page. */
  redirectTo?: string;
  submitLabel?: string;
  /** Extra controls beside Save, e.g. a delete button. */
  secondaryActions?: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();

  const { form, submit } = useAdminForm<TValues, TResult>({
    schema,
    defaultValues,
    action,
    successMessage,
    onSuccess: () => {
      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
      } else {
        router.refresh();
      }
    },
  });

  const { isSubmitting, isDirty } = form.formState;

  return (
    <Form form={form} onSubmit={submit}>
      {children}

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-2 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6">
        {secondaryActions}
        <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" size="sm" loading={isSubmitting} disabled={!isDirty}>
          {submitLabel}
        </Button>
      </div>
    </Form>
  );
}

/** Groups related fields under a heading — keeps long editors scannable. */
export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h2 className="text-small font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-caption text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}
