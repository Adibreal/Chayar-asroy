"use client";

import { ImagePlus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { listMedia, type MediaWithUrl, uploadMediaAction } from "@/server/actions/media-actions";
import type { MediaFolder } from "@/validation/media";

import { Panel } from "../feedback/panel";
import { useToast } from "../feedback/toast";
import { Dropzone } from "./dropzone";
import { MediaCard } from "./media-card";

/**
 * Choose an image from the library, or upload a new one.
 *
 * The single image-selection surface in the CMS — every editor's image field
 * opens this, so upload rules, consent warnings and browsing behave identically
 * everywhere and no editor re-implements uploading.
 */
export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  folder = "general",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: MediaWithUrl) => void;
  folder?: MediaFolder;
}) {
  const toast = useToast();
  const [items, setItems] = useState<MediaWithUrl[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, startUpload] = useTransition();

  const load = useCallback(
    async (term: string) => {
      setIsLoading(true);
      const result = await listMedia({ search: term || undefined });
      setIsLoading(false);

      if (!result.ok) {
        toast.error("Could not load media", result.error.message);
        return;
      }
      setItems(result.data.items);
    },
    [toast],
  );

  // Load on open, and re-query as the search term settles.
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => void load(search), search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [open, search, load]);

  const handleUpload = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    startUpload(async () => {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", folder);
      // Alt text is required for accessibility; it's captured in the library,
      // and flagged on the card until someone fills it in.
      formData.set("altText", "");

      const result = await uploadMediaAction(formData);
      if (!result.ok) {
        toast.error("Upload failed", result.error.message);
        return;
      }

      toast.success("Image uploaded", "Remember to add alt text in the Media library.");
      onSelect(result.data);
      onOpenChange(false);
    });
  };

  return (
    <Panel
      open={open}
      onOpenChange={onOpenChange}
      variant="drawer"
      title="Choose an image"
      description="Pick from the library, or upload a new image."
    >
      <div className="flex flex-col gap-5">
        <Dropzone onFiles={handleUpload} isUploading={isUploading} />

        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search the library…"
            aria-label="Search the media library"
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} variant="block" className="aspect-4/3" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<ImagePlus />}
            title={search ? "No matching images" : "No images yet"}
            description={
              search
                ? "Try a different search term."
                : "Upload your first image using the box above."
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((item) => (
              <MediaCard
                key={item.id}
                item={{
                  id: item.id,
                  url: item.url,
                  fileName: item.file_name,
                  altText: item.alt_text,
                  sizeBytes: item.size_bytes,
                  consentVerified: item.consent_verified,
                }}
                onSelect={() => {
                  onSelect(item);
                  onOpenChange(false);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}

/**
 * Form control for a single image: preview, choose, replace, remove.
 *
 * Stores a media **id** (what the database references) while showing the
 * preview URL, so editors never handle storage paths.
 */
export function ImageField({
  value,
  previewUrl,
  onChange,
  folder = "general",
  label = "Image",
}: {
  value?: string | null;
  previewUrl?: string | null;
  onChange: (media: { id: string; url: string } | null) => void;
  folder?: MediaFolder;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-small font-medium text-foreground">{label}</span>

      {value && previewUrl ? (
        <div className="flex items-start gap-3">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-sunken">
            <Image src={previewUrl} alt="" fill sizes="96px" className="object-cover" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onChange(null)}
              className="text-danger hover:bg-danger-soft"
            >
              <Trash2 className="size-4" aria-hidden />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="w-fit"
        >
          <ImagePlus className="size-4" aria-hidden />
          Choose image
        </Button>
      )}

      <MediaPicker
        open={open}
        onOpenChange={setOpen}
        folder={folder}
        onSelect={(media) => onChange({ id: media.id, url: media.url })}
      />
    </div>
  );
}
