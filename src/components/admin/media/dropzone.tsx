"use client";

import { CloudUpload } from "lucide-react";
import { type DragEvent, useId, useRef, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/validation/media";

/**
 * File drop target with a real `<input type="file">` underneath.
 *
 * Accessibility choice: the visible area is a `<label>` bound to the input, so
 * it is keyboard-focusable and screen-reader-announced for free — no custom
 * key handling, no `role="button"` on a div.
 *
 * Client-side checks mirror `uploadFileSchema` purely for fast feedback; the
 * Server Action and the storage bucket both re-validate.
 */
export function Dropzone({
  onFiles,
  multiple = false,
  isUploading = false,
  accept = ALLOWED_IMAGE_TYPES.join(","),
  className,
}: {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  isUploading?: boolean;
  accept?: string;
  className?: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);

    const tooLarge = files.find((file) => file.size > MAX_IMAGE_BYTES);
    if (tooLarge) {
      setRejected(
        `"${tooLarge.name}" is larger than ${MAX_IMAGE_BYTES / 1024 / 1024} MB. Try a smaller image.`,
      );
      return;
    }

    const wrongType = files.find(
      (file) => !(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type),
    );
    if (wrongType) {
      setRejected(`"${wrongType.name}" isn't a supported image (JPEG, PNG, WebP, AVIF or SVG).`);
      return;
    }

    setRejected(null);
    onFiles(files);
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files);
          // Reset so re-selecting the same file still fires `change`.
          event.target.value = "";
        }}
      />

      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary-soft"
            : "border-border-strong bg-surface hover:bg-surface-hover",
          isUploading && "pointer-events-none opacity-70",
          focusRing,
        )}
      >
        {isUploading ? (
          <>
            <Spinner />
            <span className="text-small text-muted-foreground">Uploading…</span>
          </>
        ) : (
          <>
            <CloudUpload className="size-6 text-muted-foreground" aria-hidden />
            <span className="text-small font-medium text-foreground">
              Drop {multiple ? "images" : "an image"} here, or browse
            </span>
            <span className="text-caption text-muted-foreground">
              JPEG, PNG, WebP, AVIF or SVG · up to {MAX_IMAGE_BYTES / 1024 / 1024} MB
            </span>
          </>
        )}
      </label>

      {rejected ? (
        <p role="alert" className="mt-2 text-caption text-danger">
          {rejected}
        </p>
      ) : null}
    </div>
  );
}
