"use client";

import { ImagePlus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Can, ConfirmDialog, MediaPicker, Panel, StatusBadge, useToast } from "@/components/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  createGalleryItem,
  deleteGalleryItem,
  type GalleryItemWithMedia,
  updateGalleryItem,
} from "@/server/actions/gallery-actions";
import type { ContentStatus, UserRole } from "@/types/database";

/** A programme an image can be attached to. */
export type ProgramOption = { id: string; title: string };

/**
 * Gallery editor.
 *
 * A grid rather than a table, because the image *is* the content. Ordering is
 * numeric for now — drag-and-drop would mean a new dependency and a custom
 * keyboard-accessible reorder interaction, which the brief allows deferring.
 * The `reorderGalleryItems` action is already in place for that later.
 */
export function GalleryManager({
  initialItems,
  programs,
  role,
  loadError,
}: {
  initialItems: GalleryItemWithMedia[];
  /** Programmes an image can belong to, for the edit panel. */
  programs: ProgramOption[];
  role: UserRole;
  loadError: string | null;
}) {
  const router = useRouter();
  const toast = useToast();
  /**
   * The server component is the single source of truth.
   *
   * This was `useState(initialItems)`, which froze the list at first mount:
   * `router.refresh()` re-rendered the server component and passed fresh
   * props, but `useState` ignores its initial value after mount, so a newly
   * added image never appeared until a full page load. Deriving straight from
   * props keeps the list honest and matches the project's no-client-data-store
   * rule. (React's lint rule rightly forbids the props→state effect that would
   * otherwise be reached for here — see HANDOFF §9.)
   */
  const items = initialItems;
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItemWithMedia | null>(null);
  const [isAdding, startAdd] = useTransition();

  useEffect(() => {
    if (loadError) toast.error("Could not load the gallery", loadError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadError]);

  const addImage = (media: { id: string; url: string }) => {
    startAdd(async () => {
      const result = await createGalleryItem({
        mediaId: media.id,
        orderIndex: items.length,
        status: "draft",
      });

      if (!result.ok) {
        toast.error("Could not add image", result.error.message);
        return;
      }
      toast.success("Image added", "It stays a draft until you publish it.");
      router.refresh();
    });
  };

  const remove = async (item: GalleryItemWithMedia) => {
    const result = await deleteGalleryItem(item.id);
    if (!result.ok) {
      toast.error("Could not remove", result.error.message);
      return;
    }
    toast.success("Removed from the gallery");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption text-muted-foreground">
          {items.length} {items.length === 1 ? "image" : "images"}
        </p>
        <Can role={role} minimum="editor">
          <Button size="sm" onClick={() => setPickerOpen(true)} disabled={isAdding}>
            <ImagePlus className="size-4" aria-hidden />
            Add image
          </Button>
        </Can>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<ImagePlus />}
          title="The gallery is empty"
          description="Add images from the media library. They stay drafts until you publish them."
          action={
            <Can role={role} minimum="editor">
              <Button size="sm" onClick={() => setPickerOpen(true)}>
                Add image
              </Button>
            </Can>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-4/3 bg-surface-sunken">
                {item.url ? (
                  <Image
                    src={item.url}
                    alt={item.altText}
                    fill
                    sizes="(min-width: 1024px) 30vw, 90vw"
                    className="object-cover"
                  />
                ) : null}
                <span className="absolute top-2 left-2 flex gap-1.5">
                  <StatusBadge status={item.status} />
                  {item.is_featured ? (
                    <Badge variant="accent" size="sm">
                      <Star className="size-3" aria-hidden />
                      Featured
                    </Badge>
                  ) : null}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="truncate text-small font-medium">{item.caption || item.fileName}</p>
                <p className="text-caption text-muted-foreground">
                  {item.category ? `${item.category} · ` : ""}Order {item.order_index}
                </p>

                {!item.consentVerified ? (
                  <p className="rounded-md bg-danger-soft px-2 py-1 text-caption text-danger">
                    Guardian consent not verified — cannot be published.
                  </p>
                ) : null}

                <div className="mt-auto flex items-center gap-1 pt-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(item)}>
                    Edit
                  </Button>
                  <Can role={role} minimum="admin">
                    <ConfirmDialog
                      destructive
                      title="Remove from the gallery?"
                      description="The image stays in the media library — only this gallery entry is removed."
                      confirmLabel="Remove"
                      onConfirm={() => remove(item)}
                      trigger={
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-danger hover:bg-danger-soft"
                        >
                          <Trash2 className="size-4" aria-hidden />
                          Remove
                        </Button>
                      }
                    />
                  </Can>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        folder="gallery"
        onSelect={addImage}
      />

      {/* `key` remounts per item, so fields initialise from the new item
          instead of syncing through an effect. */}
      <EditGalleryItemPanel
        key={editing?.id}
        item={editing}
        programs={programs}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}

/** Caption, credit, category, ordering and publishing for one gallery entry. */
function EditGalleryItemPanel({
  item,
  programs,
  onClose,
}: {
  item: GalleryItemWithMedia | null;
  programs: ProgramOption[];
  onClose: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const [caption, setCaption] = useState(item?.caption ?? "");
  const [photographer, setPhotographer] = useState(item?.photographer ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [programId, setProgramId] = useState(item?.program_id ?? "");
  const [orderIndex, setOrderIndex] = useState(item?.order_index ?? 0);
  const [featured, setFeatured] = useState(item?.is_featured ?? false);
  const [status, setStatus] = useState<ContentStatus>(item?.status ?? "draft");
  const [isSaving, startSave] = useTransition();

  if (!item) return null;

  const save = () => {
    startSave(async () => {
      const result = await updateGalleryItem({
        id: item.id,
        caption: caption || undefined,
        photographer: photographer || undefined,
        category: category || undefined,
        programId: programId || undefined,
        orderIndex,
        isFeatured: featured,
        status,
      });

      if (!result.ok) {
        toast.error("Could not save", result.error.message);
        return;
      }
      toast.success("Image details saved");
      onClose();
      router.refresh();
    });
  };

  return (
    <Panel
      open
      onOpenChange={(open) => !open && onClose()}
      title="Image details"
      description={item.fileName}
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
        <Field label="Caption">
          {(props) => (
            <Input {...props} value={caption} onChange={(e) => setCaption(e.target.value)} />
          )}
        </Field>

        <Field label="Photographer" description="Optional credit shown with the image.">
          {(props) => (
            <Input
              {...props}
              value={photographer}
              onChange={(e) => setPhotographer(e.target.value)}
            />
          )}
        </Field>

        <Field label="Category" description="Free text, e.g. Workshops or Community events.">
          {(props) => (
            <Input {...props} value={category} onChange={(e) => setCategory(e.target.value)} />
          )}
        </Field>

        <Field
          label="Programme"
          description="Attach this image to a programme and it appears in that programme's gallery."
        >
          {(props) => (
            <select
              {...props}
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body"
            >
              <option value="">Not attached to a programme</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Display order" description="Lower numbers appear first.">
          {(props) => (
            <Input
              {...props}
              type="number"
              min={0}
              value={orderIndex}
              onChange={(e) => setOrderIndex(Number(e.target.value))}
              className="max-w-32"
            />
          )}
        </Field>

        <Field label="Status">
          {(props) => (
            <select
              {...props}
              value={status}
              onChange={(e) => setStatus(e.target.value as ContentStatus)}
              className="h-11 w-full rounded-lg border border-input bg-surface px-3 text-body outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35"
            >
              <option value="draft">Draft</option>
              <option value="published" disabled={!item.consentVerified}>
                Published{item.consentVerified ? "" : " — needs guardian consent"}
              </option>
              <option value="archived">Archived</option>
            </select>
          )}
        </Field>

        <label className="flex items-center gap-3">
          <Checkbox
            checked={featured}
            onCheckedChange={(checked) => setFeatured(checked === true)}
          />
          <span className="text-small">Feature this image on the homepage</span>
        </label>
      </div>
    </Panel>
  );
}
