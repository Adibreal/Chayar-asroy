import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { InsertPayload, Row, TableName, UpdatePayload } from "@/types/database";

import { type Paginated, toPaginated, toRange, unwrap } from "./query";

export type ListOptions = {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  ascending?: boolean;
  /** Simple equality filters, e.g. `{ status: "published" }`. */
  filters?: Record<string, string | number | boolean | null>;
  /**
   * Case-insensitive partial match across one or more columns — powers the
   * search box on every admin table.
   */
  search?: { term: string; columns: string[] };
};

/** Escape PostgREST `or()` metacharacters so a search term can't alter the filter. */
function escapeSearchTerm(term: string): string {
  return term.replace(/[(),*]/g, " ").trim();
}

/**
 * A typed CRUD repository for one table.
 *
 * Every method runs through the **user-scoped** client, so Row Level Security
 * applies — a repository can never grant access the database wouldn't.
 *
 * Entity repositories compose this and add only their own query methods, which
 * keeps per-entity files tiny (see `src/server/repositories/`).
 *
 * @example
 * const programs = createRepository("programs");
 * const page = await programs.list({ filters: { status: "published" } });
 */
export function createRepository<T extends TableName>(table: T) {
  /**
   * supabase-js cannot infer a schema from a *generic* table name, so the
   * builder is loosened here — and only here. Callers stay fully typed via the
   * `Row<T>` / `InsertPayload<T>` signatures below.
   */
  async function from() {
    const supabase = await createClient();
    return supabase.from(table) as unknown as ReturnType<
      Awaited<ReturnType<typeof createClient>>["from"]
    >;
  }

  return {
    /** Page of rows, newest first by default, with an exact total count. */
    async list(options: ListOptions = {}): Promise<Paginated<Row<T>>> {
      const {
        page = 1,
        pageSize = 20,
        orderBy = "created_at",
        ascending = false,
        filters = {},
        search,
      } = options;

      let query = (await from()).select("*", { count: "exact" });
      for (const [column, value] of Object.entries(filters)) {
        query = value === null ? query.is(column, null) : query.eq(column, value);
      }

      const term = search ? escapeSearchTerm(search.term) : "";
      if (term && search) {
        query = query.or(search.columns.map((column) => `${column}.ilike.%${term}%`).join(","));
      }

      const [start, end] = toRange(page, pageSize);
      const response = await query.order(orderBy, { ascending }).range(start, end);

      const rows = unwrap(response) as Row<T>[];
      return toPaginated(rows, response.count ?? rows.length, page, pageSize);
    },

    /** A single row by id. Throws `NOT_FOUND` when absent or not permitted. */
    async findById(id: string): Promise<Row<T>> {
      const response = await (await from()).select("*").eq("id", id).single();
      return unwrap(response) as Row<T>;
    },

    /** A single row by any unique column — typically `slug`. */
    async findBy(column: string, value: string): Promise<Row<T>> {
      const response = await (await from()).select("*").eq(column, value).single();
      return unwrap(response) as Row<T>;
    },

    /** `null` instead of throwing when the row doesn't exist. */
    async findOptional(column: string, value: string): Promise<Row<T> | null> {
      const response = await (await from()).select("*").eq(column, value).maybeSingle();
      if (response.error) return null;
      return (response.data as Row<T> | null) ?? null;
    },

    async create(payload: InsertPayload<T>): Promise<Row<T>> {
      const response = await (
        await from()
      )
        .insert(payload as never)
        .select("*")
        .single();
      return unwrap(response) as Row<T>;
    },

    async update(id: string, payload: UpdatePayload<T>): Promise<Row<T>> {
      const response = await (
        await from()
      )
        .update(payload as never)
        .eq("id", id)
        .select("*")
        .single();
      return unwrap(response) as Row<T>;
    },

    /** Hard delete. Most content should be archived (`status`) instead. */
    async remove(id: string): Promise<void> {
      const { error } = await (await from()).delete().eq("id", id);
      if (error) unwrap({ data: null, error });
    },
  };
}

export type Repository<T extends TableName> = ReturnType<typeof createRepository<T>>;
