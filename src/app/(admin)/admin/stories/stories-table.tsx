"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Can,
  ConfirmDialog,
  DataTable,
  type DataTableColumn,
  RowAction,
  RowActions,
  RowActionSeparator,
  StatusBadge,
  TablePagination,
  TableToolbar,
  useToast,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { canDelete as roleCanDelete } from "@/lib/permissions";
import { deleteStory } from "@/server/actions/story-actions";
import type { Story, UserRole } from "@/types/database";

/** Stories list — same shared table framework as Programs. */
export function StoriesTable({
  rows,
  page,
  pageSize,
  total,
  pageCount,
  role,
}: {
  rows: Story[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  role: UserRole;
}) {
  const router = useRouter();
  const toast = useToast();
  // The row menu unmounts when it closes, which would take a nested dialog with
  // it — so the confirm dialog is rendered once here and driven by state.
  const [deleteTarget, setDeleteTarget] = useState<Story | null>(null);
  // UX only — RLS is what actually enforces admin-only deletes.
  const canDelete = roleCanDelete(role);

  const handleDelete = async (story: Story) => {
    const result = await deleteStory(story.id);
    if (!result.ok) {
      toast.error("Could not delete", result.error.message);
      return;
    }
    toast.success("Story deleted");
    router.refresh();
  };

  const columns: DataTableColumn<Story>[] = [
    {
      id: "title",
      header: "Title",
      sortable: true,
      cell: (story) => (
        <div className="min-w-0">
          <Link
            href={`/admin/stories/${story.id}`}
            className="font-medium text-foreground hover:text-primary hover:underline"
          >
            {story.title}
          </Link>
          <p className="truncate text-caption text-muted-foreground">/{story.slug}</p>
        </div>
      ),
    },
    {
      id: "author_name",
      header: "Author",
      className: "hidden md:table-cell",
      cell: (story) => <span className="text-muted-foreground">{story.author_name ?? "—"}</span>,
    },
    {
      id: "published_at",
      header: "Published",
      sortable: true,
      className: "hidden lg:table-cell",
      cell: (story) => (
        <span className="text-muted-foreground">
          {story.published_at ? new Date(story.published_at).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      cell: (story) => <StatusBadge status={story.status} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        searchPlaceholder="Search stories…"
        actions={
          <Can role={role} minimum="editor">
            <Button asChild size="sm">
              <Link href="/admin/stories/new">New story</Link>
            </Button>
          </Can>
        }
      />

      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(story) => story.id}
        caption="Stories"
        rowActions={(story) => (
          <RowActions label={`Actions for ${story.title}`}>
            <RowAction
              icon={<Pencil className="size-4" aria-hidden />}
              onSelect={() => router.push(`/admin/stories/${story.id}`)}
            >
              Edit
            </RowAction>
            {canDelete ? (
              <>
                <RowActionSeparator />
                <RowAction
                  destructive
                  icon={<Trash2 className="size-4" aria-hidden />}
                  onSelect={() => setDeleteTarget(story)}
                >
                  Delete
                </RowAction>
              </>
            ) : null}
          </RowActions>
        )}
        emptyState={
          <EmptyState
            title="No stories yet"
            description="Stories are the longer narratives shown on the website."
            action={
              <Can role={role} minimum="editor">
                <Button asChild size="sm">
                  <Link href="/admin/stories/new">New story</Link>
                </Button>
              </Can>
            }
          />
        }
      />

      <TablePagination page={page} pageSize={pageSize} total={total} pageCount={pageCount} />

      {/* One dialog, driven by the row menu's selection. */}
      {deleteTarget ? (
        <ConfirmDialog
          key={deleteTarget.id}
          open
          onOpenChange={(next) => !next && setDeleteTarget(null)}
          destructive
          title="Delete this story?"
          description={
            <>
              <strong>{deleteTarget.title}</strong> will be permanently removed. Consider archiving
              it instead to keep it for reference.
            </>
          }
          confirmLabel="Delete story"
          onConfirm={() => handleDelete(deleteTarget)}
        />
      ) : null}
    </div>
  );
}
