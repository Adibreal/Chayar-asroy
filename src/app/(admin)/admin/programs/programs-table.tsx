"use client";

import { Pencil, Sparkles, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { canDelete as roleCanDelete } from "@/lib/permissions";
import { deleteProgram } from "@/server/actions/program-actions";
import type { Program, UserRole } from "@/types/database";

/**
 * Programs list — assembled from the shared table framework. It contributes
 * only column definitions and row actions; search, sorting, paging, selection
 * and empty states all come from `DataTable` and friends.
 */
export function ProgramsTable({
  rows,
  page,
  pageSize,
  total,
  pageCount,
  role,
}: {
  rows: Program[];
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
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null);
  // UX only — RLS is what actually enforces admin-only deletes.
  const canDelete = roleCanDelete(role);

  const handleDelete = async (program: Program) => {
    const result = await deleteProgram(program.id);
    if (!result.ok) {
      toast.error("Could not delete", result.error.message);
      return;
    }
    toast.success("Program deleted");
    router.refresh();
  };

  const columns: DataTableColumn<Program>[] = [
    {
      id: "title",
      header: "Title",
      sortable: true,
      cell: (program) => (
        <div className="min-w-0">
          <Link
            href={`/admin/programs/${program.id}`}
            className="font-medium text-foreground hover:text-primary hover:underline"
          >
            {program.title}
          </Link>
          <p className="truncate text-caption text-muted-foreground">/{program.slug}</p>
        </div>
      ),
    },
    {
      id: "category",
      header: "Category",
      className: "hidden sm:table-cell",
      cell: (program) => <Badge size="sm">{program.category}</Badge>,
    },
    {
      id: "is_featured",
      header: "Featured",
      className: "hidden lg:table-cell",
      cell: (program) =>
        program.is_featured ? (
          <span className="inline-flex items-center gap-1 text-caption text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            Featured
          </span>
        ) : (
          <span className="text-caption text-muted-foreground">—</span>
        ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      cell: (program) => <StatusBadge status={program.status} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        searchPlaceholder="Search programs…"
        actions={
          <Can role={role} minimum="editor">
            <Button asChild size="sm">
              <Link href="/admin/programs/new">New program</Link>
            </Button>
          </Can>
        }
      />

      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(program) => program.id}
        caption="Programs"
        rowActions={(program) => (
          <RowActions label={`Actions for ${program.title}`}>
            <RowAction
              icon={<Pencil className="size-4" aria-hidden />}
              onSelect={() => router.push(`/admin/programs/${program.id}`)}
            >
              Edit
            </RowAction>
            {canDelete ? (
              <>
                <RowActionSeparator />
                <RowAction
                  destructive
                  icon={<Trash2 className="size-4" aria-hidden />}
                  onSelect={() => setDeleteTarget(program)}
                >
                  Delete
                </RowAction>
              </>
            ) : null}
          </RowActions>
        )}
        emptyState={
          <EmptyState
            title="No programs yet"
            description="Programs are the initiatives shown on the website. Create your first one to get started."
            action={
              <Can role={role} minimum="editor">
                <Button asChild size="sm">
                  <Link href="/admin/programs/new">New program</Link>
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
          title="Delete this program?"
          description={
            <>
              <strong>{deleteTarget.title}</strong> will be permanently removed. Consider archiving
              it instead to keep it for reference.
            </>
          }
          confirmLabel="Delete program"
          onConfirm={() => handleDelete(deleteTarget)}
        />
      ) : null}
    </div>
  );
}
