"use client";

import { type ReactNode, useId } from "react";

import { cn } from "@/lib/utils";

import { Label } from "./label";

/** Props the field passes to its control for correct wiring. */
export type FieldControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

type FieldProps = {
  label?: ReactNode;
  /** Helper text shown below the control (hidden when an error is present). */
  description?: ReactNode;
  /** Error message; sets the control's invalid state and is announced. */
  error?: ReactNode;
  required?: boolean;
  className?: string;
  /** Render-prop receiving the wired accessibility props for the control. */
  children: (props: FieldControlProps) => ReactNode;
};

/**
 * Accessible field wrapper. Generates a stable `id`, links the label, and wires
 * `aria-describedby` (to description/error) and `aria-invalid` onto the control
 * via a render-prop — so every form field is correct by construction.
 *
 * @example
 * <Field label="Email" error={errors.email}>
 *   {(p) => <Input type="email" {...p} />}
 * </Field>
 */
export function Field({ label, description, error, required, className, children }: FieldProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      ) : null}

      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}

      {description && !error ? (
        <p id={descriptionId} className="text-caption text-muted-foreground">
          {description}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-caption text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
