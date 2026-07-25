"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { ReactNode } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

import { useTableParams } from "./use-table-params";

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  /** Renders the cell. Keep it presentational — no data fetching. */
  cell: (row: T) => ReactNode;
  sortable?: boolean;
  /** Extra classes for both header and cell, e.g. `hidden md:table-cell`. */
  className?: string;
  align?: "left" | "right";
};

type DataTableProps<T> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  /** Shown when there are no rows — pass an `<EmptyState>`. */
  emptyState: ReactNode;
  /** Enables the selection column; omit for a read-only table. */
  selection?: {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
  };
  /** Per-row buttons, rendered in a trailing column. */
  rowActions?: (row: T) => ReactNode;
  caption?: string;
};

/**
 * The CMS table. Every list screen uses it, so sorting, selection, empty and
 * busy states behave identically everywhere.
 *
 * Semantics first: a real `<table>` with `<th scope="col">`, an accessible
 * caption, and `aria-sort` on sorted columns — so screen readers and keyboard
 * users get the same structure sighted users do.
 *
 * Responsive strategy: columns opt out on small screens via
 * `className: "hidden md:table-cell"` rather than switching to a card layout,
 * which keeps one markup path and one mental model.
 */
export function DataTable<T>({
  rows,
  columns,
  getRowId,
  emptyState,
  selection,
  rowActions,
  caption,
}: DataTableProps<T>) {
  const { sort, toggleSort, isPending } = useTableParams();

  const allSelected = selection
    ? rows.length > 0 && selection.selectedIds.length === rows.length
    : false;
  const someSelected = selection ? selection.selectedIds.length > 0 && !allSelected : false;

  const toggleAll = () => {
    if (!selection) return;
    selection.onChange(allSelected ? [] : rows.map(getRowId));
  };

  const toggleRow = (id: string) => {
    if (!selection) return;
    selection.onChange(
      selection.selectedIds.includes(id)
        ? selection.selectedIds.filter((selectedId) => selectedId !== id)
        : [...selection.selectedIds, id],
    );
  };

  if (rows.length === 0) {
    return <div className="rounded-xl border border-border bg-card">{emptyState}</div>;
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card">
      {isPending ? (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-x-0 top-0 z-10 flex justify-center bg-card/70 py-2"
        >
          <Spinner size="sm" />
          <span className="sr-only">Updating results…</span>
        </div>
      ) : null}

      {/* Horizontal scroll keeps wide tables usable without breaking layout. */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-small">
          {caption ? <caption className="sr-only">{caption}</caption> : null}

          <thead>
            <tr className="border-b border-border bg-surface-sunken/60">
              {selection ? (
                <th scope="col" className="w-10 px-3 py-2.5">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={toggleAll}
                    aria-label={allSelected ? "Deselect all rows" : "Select all rows"}
                  />
                </th>
              ) : null}

              {columns.map((column) => {
                const isSorted = sort === column.id || sort === `-${column.id}`;
                const descending = sort === `-${column.id}`;

                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={isSorted ? (descending ? "descending" : "ascending") : undefined}
                    className={cn(
                      "px-3 py-2.5 font-semibold text-muted-foreground",
                      column.align === "right" ? "text-right" : "text-left",
                      column.className,
                    )}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.id)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded transition-colors hover:text-foreground",
                          focusRing,
                        )}
                      >
                        {column.header}
                        {isSorted ? (
                          descending ? (
                            <ArrowDown className="size-3.5" aria-hidden />
                          ) : (
                            <ArrowUp className="size-3.5" aria-hidden />
                          )
                        ) : (
                          <ChevronsUpDown className="size-3.5 opacity-40" aria-hidden />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}

              {rowActions ? (
                <th scope="col" className="w-12 px-3 py-2.5 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const id = getRowId(row);
              const selected = selection?.selectedIds.includes(id) ?? false;

              return (
                <tr
                  key={id}
                  data-selected={selected || undefined}
                  className="border-b border-border last:border-0 hover:bg-surface-hover/60 data-[selected]:bg-primary-soft/40"
                >
                  {selection ? (
                    <td className="px-3 py-2.5">
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => toggleRow(id)}
                        aria-label={`Select row ${id}`}
                      />
                    </td>
                  ) : null}

                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        "px-3 py-2.5 align-middle",
                        column.align === "right" ? "text-right" : "text-left",
                        column.className,
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}

                  {rowActions ? (
                    <td className="px-3 py-2.5 text-right">{rowActions(row)}</td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
