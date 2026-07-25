"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

/**
 * Table state (search, sort, page, filters) lives in the URL.
 *
 * That choice is deliberate: state stays shareable and bookmarkable, the back
 * button works, and Server Components can read `searchParams` and fetch exactly
 * the right rows — no client-side data store required.
 *
 * `isPending` comes from a transition, so tables can show a subtle busy state
 * instead of blocking the UI.
 */
export function useTableParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setParams = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      // Any change other than paging returns to page 1, or the user could land
      // on an out-of-range page with no results.
      if (!("page" in updates)) params.delete("page");

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const get = useCallback((key: string) => searchParams.get(key) ?? "", [searchParams]);

  const toggleSort = useCallback(
    (columnId: string) => {
      const current = searchParams.get("sort");
      const descending = current === columnId;
      setParams({ sort: descending ? `-${columnId}` : columnId });
    },
    [searchParams, setParams],
  );

  return {
    get,
    setParams,
    toggleSort,
    isPending,
    search: searchParams.get("q") ?? "",
    sort: searchParams.get("sort") ?? "",
    page: Number(searchParams.get("page") ?? 1),
  };
}
