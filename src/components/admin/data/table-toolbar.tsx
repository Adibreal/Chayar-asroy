"use client";

import { Search, X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useTableParams } from "./use-table-params";

/**
 * Toolbar above a `DataTable`: search, filter slots, and a bulk-action bar that
 * appears only when rows are selected.
 *
 * Search is debounced and written to the URL, so typing doesn't fire a request
 * per keystroke and the result stays linkable.
 */
export function TableToolbar({
  searchPlaceholder = "Search…",
  filters,
  actions,
  selectedCount = 0,
  bulkActions,
  onClearSelection,
}: {
  searchPlaceholder?: string;
  /** Filter controls (e.g. a status `Select`). */
  filters?: ReactNode;
  /** Right-aligned actions, e.g. "New program". */
  actions?: ReactNode;
  selectedCount?: number;
  bulkActions?: ReactNode;
  onClearSelection?: () => void;
}) {
  const { search, setParams } = useTableParams();
  const [value, setValue] = useState(search);
  const [lastSearch, setLastSearch] = useState(search);

  // Keep the input in sync when the URL changes elsewhere (back button, reset).
  // Adjusting state *during render* is React's recommended pattern here — an
  // effect would cause an extra render pass and a visible flash of stale text.
  if (search !== lastSearch) {
    setLastSearch(search);
    setValue(search);
  }

  useEffect(() => {
    if (value === search) return;
    const timer = setTimeout(() => setParams({ q: value || null }), 300);
    return () => clearTimeout(timer);
  }, [value, search, setParams]);

  const hasSelection = selectedCount > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="pl-9"
            />
          </div>
          {filters}
        </div>

        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>

      {/* Announced politely so screen-reader users learn a selection exists. */}
      {hasSelection ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "flex flex-wrap items-center gap-3 rounded-lg border border-primary/30 bg-primary-soft px-3 py-2",
          )}
        >
          <span className="text-small font-medium">{selectedCount} selected</span>
          <div className="flex flex-1 flex-wrap items-center gap-2">{bulkActions}</div>
          {onClearSelection ? (
            <Button variant="ghost" size="sm" onClick={onClearSelection}>
              <X className="size-4" aria-hidden />
              Clear
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
