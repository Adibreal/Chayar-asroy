"use client";

import { Controller, type FieldValues, type Path, useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";

/**
 * Form-bound checkbox with its label and hint.
 *
 * `Field` is built around text inputs (label above, error below), which reads
 * poorly for a checkbox — so this lays the label beside the control while
 * keeping the same accessible wiring.
 */
export function CheckboxFormField<T extends FieldValues>({
  name,
  label,
  description,
}: {
  name: Path<T>;
  label: string;
  description?: string;
}) {
  const { control } = useFormContext<T>();
  const describedBy = description ? `${name}-description` : undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className="flex items-start gap-3">
          <Checkbox
            checked={Boolean(field.value)}
            onCheckedChange={(checked) => field.onChange(checked === true)}
            onBlur={field.onBlur}
            aria-describedby={describedBy}
          />
          <span className="min-w-0">
            <span className="block text-small font-medium text-foreground">{label}</span>
            {description ? (
              <span id={describedBy} className="block text-caption text-muted-foreground">
                {description}
              </span>
            ) : null}
          </span>
        </label>
      )}
    />
  );
}
