import "server-only";

import { revalidatePath } from "next/cache";
import type { z } from "zod";

import { requireAdmin, requireEditor } from "@/server/auth/session";
import { createRepository } from "@/server/db/repository";
import { AppError } from "@/server/shared/errors";
import { attempt, type Result } from "@/server/shared/result";
import type { Row, TableName } from "@/types/database";

/**
 * Form input is camelCase; the database is snake_case. Converting
 * automatically removes a per-entity mapping function — and with it a whole
 * class of "I forgot to map that field" bugs.
 */
function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/** Map validated input to a database row payload, dropping `undefined`. */
export function toRowPayload(input: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    row[camelToSnake(key)] = value;
  }
  return row;
}

type EntityActionConfig<T extends TableName> = {
  table: T;
  createSchema: z.ZodType;
  /** Update schema — must include `id`. */
  updateSchema: z.ZodType;
  /** Paths to refresh after a successful write (admin list + public page). */
  revalidate?: string[];
  /**
   * Hook to derive extra columns from the validated input, e.g. stamping
   * `published_at` when status flips to published.
   */
  beforeWrite?: (row: Record<string, unknown>) => Record<string, unknown>;
};

/**
 * CRUD Server Action handlers for one table.
 *
 * This is the single implementation of "validate → authorize → write →
 * revalidate" for content. Every editor delegates to it, so there is exactly
 * one place where content is created, updated, deleted or reordered.
 *
 * Roles follow the model in `docs/BACKEND.md`: editors write, admins delete.
 * RLS re-checks both — these guards produce clear errors, they aren't the
 * guarantee.
 *
 * Returned handlers are wrapped by a small per-entity `"use server"` module,
 * because Next.js requires every export of such a file to be an async function.
 */
export function createEntityActions<T extends TableName>(config: EntityActionConfig<T>) {
  const repository = createRepository(config.table);

  const refresh = () => {
    for (const path of config.revalidate ?? []) revalidatePath(path);
  };

  const parse = (schema: z.ZodType, input: unknown) => {
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      throw new AppError("VALIDATION", "Please check the highlighted fields.", {
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      });
    }
    return parsed.data as Record<string, unknown>;
  };

  const buildRow = (input: Record<string, unknown>) => {
    const row = toRowPayload(input);
    return config.beforeWrite ? config.beforeWrite(row) : row;
  };

  return {
    async create(input: unknown): Promise<Result<Row<T>>> {
      return attempt(async () => {
        const user = await requireEditor();
        const values = parse(config.createSchema, input);
        const row = await repository.create({
          ...buildRow(values),
          updated_by: user.id,
        } as never);
        refresh();
        return row;
      });
    },

    async update(input: unknown): Promise<Result<Row<T>>> {
      return attempt(async () => {
        const user = await requireEditor();
        const { id, ...rest } = parse(config.updateSchema, input);
        const row = await repository.update(String(id), {
          ...buildRow(rest),
          updated_by: user.id,
        } as never);
        refresh();
        return row;
      });
    },

    /** Hard delete — admin only. Prefer archiving via `update`. */
    async remove(id: unknown): Promise<Result<{ id: string }>> {
      return attempt(async () => {
        await requireAdmin();
        if (typeof id !== "string") throw new AppError("VALIDATION", "Missing id.");
        await repository.remove(id);
        refresh();
        return { id };
      });
    },

    /** Persist a new display order for a list of ids. */
    async reorder(ids: unknown): Promise<Result<{ count: number }>> {
      return attempt(async () => {
        await requireEditor();
        if (!Array.isArray(ids)) throw new AppError("VALIDATION", "Expected a list of ids.");
        await Promise.all(
          ids.map((id, index) => repository.update(String(id), { order_index: index } as never)),
        );
        refresh();
        return { count: ids.length };
      });
    },
  };
}
