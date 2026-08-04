"use client";

import { Check, Copy, ImagePlus, Search, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { Can, ConfirmDialog, Dropzone, MediaCard, Panel, useToast } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteMediaAction,
  listMedia,
  type MediaWithUrl,
  updateMediaAction,
  uploadMediaAction,
} from "@/server/actions/media-actions";
import type { UserRole } from "@/types/database";

/**
 * The media library.
 *
 * Upload, search, edit metadata, copy URL and delete — built entirely from the
 * Phase 5B primitives (`Dropzone`, `MediaCard`, `Panel`, `ConfirmDialog`,
 * `useToast`) and the Phase 5A storage layer. No upload or delete logic is
 * reimplemented here.
 */
export function MediaLibrary({
  initialItems,
  total,
  role,
  loadError,
}: {
  initialItems: MediaWithUrl[];
  total: number;
  role: UserRole;
  loadError: string | null;
}) {
  const toast = useToast();
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<MediaWithUrl | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();

  useEffect(() => {
    if (loadError) toast.error("Could not load media", loadError);
    // Only announce the initial failure, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadError]);

  const refresh = async (term = search) => {
    const result = await listMedia({ search: term || undefined });
    if (result.ok) setItems(result.data.items);
  };

  // Re-query as the search term settles.
  useEffect(() => {
    const timer = setTimeout(() => void refresh(search), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleUpload = (files: File[]) => {
    startUpload(async () => {
      for (const file of files) {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("folder", "general");
        formData.set("altText", "");

        const result = await uploadMediaAction(formData);
        if (!result.ok) {
          toast.error(`Could not upload ${file.name}`, result.error.message);
          return;
        }
      }
      toast.success(
        files.length > 1 ? `${files.length} images uploaded` : "Image uploaded",
        "Add alt text so screen readers can describe it.",
      );
      await refresh();
    });
  };

  const copyUrl = async (item: MediaWithUrl) => {
    await navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDelete = async (item: MediaWithUrl) => {
    const result = await deleteMediaAction(item.id);
    if (!result.ok) {
      toast.error("Could not delete", result.error.message);
      return;
    }
    toast.success("Image deleted");
    setItems((current) => current.filter((entry) => entry.id !== item.id));
  };

  return (
    <div className="flex flex-col gap-6">
      <Dropzone onFiles={handleUpload} multiple isUploading={isUploading} />

      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by file name, alt text or caption…"
          aria-label="Search media"
          className="pl-9"
        />
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<ImagePlus />}
          title={search ? "No matching images" : "No images yet"}
          description={
            search
              ? "Try a different search term."
              : "Upload images using the box above — they'll be available to every editor."
          }
        />
      ) : (
        <>
          <p className="text-caption text-muted-foreground" aria-live="polite">
            {items.length} of {total} {total === 1 ? "image" : "images"}
          </p>

          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <li key={item.id} className="flex flex-col gap-2">
                <MediaCard
                  item={{
                    id: item.id,
                    url: item.url,
                    fileName: item.file_name,
                    altText: item.alt_text,
                    sizeBytes: item.size_bytes,
                    consentVerified: item.consent_verified,
                  }}
                  onSelect={() => setEditing(item)}
                />

                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" onClick={() => void copyUrl(item)}>
                    {copiedId === item.id ? (
                      <Check className="size-4 text-success" aria-hidden />
                    ) : (
                      <Copy className="size-4" aria-hidden />
                    )}
                    {copiedId === item.id ? "Copied" : "Copy URL"}
                  </Button>

                  <Can role={role} minimum="admin">
                    <ConfirmDialog
                      destructive
                      title="Delete this image?"
                      description={
                        <>
                          <strong>{item.file_name}</strong> will be permanently removed. Anywhere it
                          is used on the website will fall back to a placeholder.
                        </>
                      }
                      confirmLabel="Delete image"
                      onConfirm={() => handleDelete(item)}
                      trigger={
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-danger hover:bg-danger-soft"
                        >
                          <Trash2 className="size-4" aria-hidden />
                          Delete
                        </Button>
                      }
                    />
                  </Can>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* `key` remounts the panel per image, so its fields initialise from the
          new item instead of syncing through an effect. */}
      <EditMediaPanel
        key={editing?.id}
        item={editing}
        onClose={() => setEditing(null)}
        onSaved={(updated) => {
          setItems((current) =>
            current.map((entry) => (entry.id === updated.id ? { ...entry, ...updated } : entry)),
          );
          setEditing(null);
        }}
      />
    </div>
  );
}

/** Edit alt text, caption and consent for one image. */
function EditMediaPanel({
  item,
  onClose,
  onSaved,
}: {
  item: MediaWithUrl | null;
  onClose: () => void;
  onSaved: (updated: MediaWithUrl) => void;
}) {
  const toast = useToast();
  const [altText, setAltText] = useState(item?.alt_text ?? "");
  const [caption, setCaption] = useState(item?.caption ?? "");
  const [consent, setConsent] = useState(item?.consent_verified ?? false);
  const [altError, setAltError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();

  if (!item) return null;

  const save = () => {
    startSave(async () => {
      const result = await updateMediaAction({
        id: item.id,
        altText,
        caption: caption || undefined,
        consentVerified: consent,
      });

      if (!result.ok) {
        // The schema runs on the server; the panel just shows what it said, so
        // there is no second copy of the rule to drift out of sync.
        setAltError(result.error.fieldErrors?.altText?.[0] ?? null);
        toast.error("Could not save", result.error.message);
        return;
      }
      setAltError(null);
      toast.success("Image details saved");
      onSaved({ ...item, ...result.data });
    });
  };

  return (
    <Panel
      open
      onOpenChange={(open) => !open && onClose()}
      title="Image details"
      description={item.file_name}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button size="sm" onClick={save} loading={isSaving}>
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field
          label="Alt text"
          required
          {...(altError ? { error: altError } : {})}
          description="Describe the image for people using a screen reader."
        >
          {(props) => (
            <Input
              {...props}
              value={altText}
              onChange={(event) => {
                setAltText(event.target.value);
                setAltError(null);
              }}
              placeholder="Children painting at a weekend workshop"
            />
          )}
        </Field>

        <Field label="Caption" description="Optional text shown beneath the image.">
          {(props) => (
            <Textarea
              {...props}
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              rows={3}
            />
          )}
        </Field>

        <label className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3">
          <Checkbox
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
            aria-describedby="consent-help"
          />
          <span>
            <span className="block text-small font-medium">Guardian consent verified</span>
            <span id="consent-help" className="block text-caption text-muted-foreground">
              Required before this image can be published in the gallery. The database enforces
              this.
            </span>
          </span>
        </label>
      </div>
    </Panel>
  );
}
