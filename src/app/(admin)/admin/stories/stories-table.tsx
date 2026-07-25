"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Can,
  DataTable,
  type DataTableColumn,
  RowAction,
  RowActions,
  StatusBadge,
  TablePagination,
  TableToolbar,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
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
    </div>
  );
}
