"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useTableParams } from "./use-table-params";

/**
 * Pagination for `DataTable`, driven by the same URL state.
 *
 * Shows a plain-language range ("1–20 of 87") rather than page numbers alone —
 * clearer for non-technical volunteers. Renders nothing for a single page.
 */
export function TablePagination({
  page,
  pageSize,
  total,
  pageCount,
}: {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}) {
  const { setParams, isPending } = useTableParams();
  if (pageCount <= 1) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-caption text-muted-foreground" aria-live="polite">
        Showing{" "}
        <strong className="font-medium text-foreground">
          {first}–{last}
        </strong>{" "}
        of <strong className="font-medium text-foreground">{total}</strong>
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || isPending}
          onClick={() => setParams({ page: page - 1 })}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Previous
        </Button>
        <span className="text-caption text-muted-foreground">
          Page {page} of {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= pageCount || isPending}
          onClick={() => setParams({ page: page + 1 })}
        >
          Next
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
