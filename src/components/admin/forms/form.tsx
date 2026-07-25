"use client";

import type { ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  FormProvider,
  type Path,
  type UseFormReturn,
  useFormContext,
} from "react-hook-form";

import { Field } from "@/components/ui/field";
import { cn } from "@/lib/utils";

/**
 * Form shell. Provides RHF context so nested fields need no prop drilling, and
 * disables the whole form while submitting via a native `<fieldset>` — one
 * attribute instead of a `disabled` prop on every control.
 */
export function Form<T extends FieldValues>({
  form,
  onSubmit,
  className,
  children,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: React.FormEvent) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className={cn("flex flex-col gap-6", className)}>
        <fieldset disabled={form.formState.isSubmitting} className="contents">
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
}

/**
 * Binds one RHF field to the design system's accessible `<Field>` wrapper,
 * which already wires `id`, `aria-describedby` and `aria-invalid`.
 *
 * Children receive the control props *and* the RHF field, so any input works:
 *
 * @example
 * <FormField name="title" label="Title" required>
 *   {({ field, controlProps }) => <Input {...field} {...controlProps} />}
 * </FormField>
 */
export function FormField<T extends FieldValues>({
  name,
  label,
  description,
  required,
  control,
  children,
}: {
  name: Path<T>;
  label?: ReactNode;
  description?: ReactNode;
  required?: boolean;
  control?: Control<T>;
  children: (args: {
    field: FieldRenderProps;
    controlProps: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean };
  }) => ReactNode;
}) {
  const context = useFormContext<T>();
  const resolvedControl = control ?? context.control;

  return (
    <Controller
      name={name}
      control={resolvedControl}
      render={({ field, fieldState }) => (
        <Field
          label={label}
          description={description}
          required={required}
          error={fieldState.error?.message}
        >
          {(controlProps) =>
            children({
              field: {
                name: field.name,
                value: field.value ?? "",
                onChange: field.onChange,
                onBlur: field.onBlur,
                ref: field.ref,
              } as FieldRenderProps,
              controlProps,
            })
          }
        </Field>
      )}
    />
  );
}

/** Shape handed to `FormField` children — matches native input props. */
export type FieldRenderProps = {
  name: string;
  value: string;
  onChange: (event: unknown) => void;
  onBlur: () => void;
  ref: React.Ref<never>;
};
