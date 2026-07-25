"use client";

import { useState } from "react";
import { Controller, type FieldValues, type Path, useFormContext } from "react-hook-form";

import type { MediaFolder } from "@/validation/media";

import { ImageField } from "../media/media-picker";

/**
 * Form-bound image picker.
 *
 * The selected media **id is the form value**, managed by a React Hook Form
 * `Controller`. That matters: a previous version kept the selection in local
 * state and mirrored it into a hidden input, which never called `onChange` — so
 * picking an image looked right but silently saved nothing.
 *
 * Only the preview URL is local state, because it is presentation, not data.
 *
 * @example
 * <ImageFormField name="coverMediaId" label="Cover" folder="programs" initialUrl={coverUrl} />
 */
export function ImageFormField<T extends FieldValues>({
  name,
  label = "Image",
  folder = "general",
  initialUrl,
}: {
  name: Path<T>;
  label?: string;
  folder?: MediaFolder;
  /** Preview for the already-saved image, resolved on the server. */
  initialUrl?: string | null;
}) {
  const { control } = useFormContext<T>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ImageField
          label={label}
          folder={folder}
          value={(field.value as string | undefined) ?? null}
          previewUrl={previewUrl}
          onChange={(media) => {
            // The id goes to the form; the URL is only for the preview.
            field.onChange(media?.id ?? undefined);
            setPreviewUrl(media?.url ?? null);
          }}
        />
      )}
    />
  );
}
