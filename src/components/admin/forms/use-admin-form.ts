"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
  useForm,
} from "react-hook-form";
import type { z } from "zod";

import type { Result } from "@/server/shared/result";

import { useToast } from "../feedback/toast";

/**
 * The one way to build a CMS form.
 *
 * Ties together the three pieces every editor needs, so no screen re-invents
 * them:
 *   - **React Hook Form** for state, using the *same* Zod schema the Server
 *     Action validates against — client and server can never disagree.
 *   - **Server Action** submission returning `Result<T>`.
 *   - **Error routing**: `fieldErrors` from the server attach to the matching
 *     inputs; anything else surfaces as a toast.
 *
 * `TValues` is inferred from `defaultValues`, or can be given explicitly:
 *
 * @example
 * const { form, submit } = useAdminForm<ProgramInput, Program>({
 *   schema: programSchema,
 *   defaultValues: program,
 *   action: updateProgram,
 *   successMessage: "Program saved",
 * });
 */
export function useAdminForm<TValues extends FieldValues, TResult = unknown>({
  schema,
  defaultValues,
  action,
  successMessage,
  onSuccess,
}: {
  /** The same schema the Server Action parses with. */
  schema: z.ZodType;
  defaultValues?: DefaultValues<TValues>;
  action: (input: unknown) => Promise<Result<TResult>>;
  successMessage?: string;
  onSuccess?: (data: TResult) => void;
}) {
  const toast = useToast();

  const form = useForm<TValues>({
    // The schema validates the same shape the form holds; RHF can't prove that
    // link across the generic boundary, so the resolver is asserted here once.
    resolver: standardSchemaResolver(schema) as Resolver<TValues>,
    defaultValues,
    // Validate on blur, then live once a field has errored — corrective
    // feedback without punishing someone mid-typing.
    mode: "onTouched",
  });

  const submit = form.handleSubmit(async (values) => {
    const result = await action(values);

    if (result.ok) {
      if (successMessage) toast.success(successMessage);
      // Re-baseline so the form is no longer "dirty" after a successful save.
      form.reset(values as DefaultValues<TValues>);
      onSuccess?.(result.data);
      return;
    }

    const { message, fieldErrors } = result.error;

    if (fieldErrors) {
      for (const [field, messages] of Object.entries(fieldErrors)) {
        const text = messages?.[0];
        if (text) form.setError(field as Path<TValues>, { message: text });
      }
    }

    // Field-level errors are already visible inline; only shout about the rest.
    if (!fieldErrors || Object.keys(fieldErrors).length === 0) {
      toast.error("Could not save", message);
    }
  });

  return { form, submit, isSubmitting: form.formState.isSubmitting };
}
