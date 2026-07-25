import "server-only";

import type { PostgrestError } from "@supabase/supabase-js";

import { errors, fromPostgrestError } from "@/server/shared/errors";

/** Page of rows plus everything a paginator needs to render itself. */
export type Paginated<T> = {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

/** Convert a 1-based page into the inclusive `range()` bounds PostgREST wants. */
export function toRange(page: number, pageSize: number): [number, number] {
  const from = (page - 1) * pageSize;
  return [from, from + pageSize - 1];
}

export function toPaginated<T>(
  rows: T[],
  total: number,
  page: number,
  pageSize: number,
): Paginated<T> {
  return {
    rows,
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/**
 * Unwrap a PostgREST response, throwing a typed `AppError` on failure.
 *
 * Every query goes through this, so error translation lives in exactly one
 * place instead of being repeated at each call site.
 */
export function unwrap<T>(response: { data: T | null; error: PostgrestError | null }): T {
  if (response.error) throw fromPostgrestError(response.error);
  // A null payload with no error means the row was absent or hidden by RLS.
  if (response.data === null) throw errors.notFound();
  return response.data;
}
