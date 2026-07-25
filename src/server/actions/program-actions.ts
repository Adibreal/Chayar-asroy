"use server";

import { createEntityActions } from "@/server/actions/entity-actions";
import { programSchema, programUpdateSchema } from "@/validation/content";

/**
 * Program Server Actions.
 *
 * All behaviour comes from `createEntityActions` — this file only names the
 * table, schemas and the paths to refresh. Next.js requires every export of a
 * `"use server"` module to be an async function, hence the thin wrappers.
 */
const actions = createEntityActions({
  table: "programs",
  createSchema: programSchema,
  updateSchema: programUpdateSchema,
  revalidate: ["/admin/programs", "/programs", "/"],
  beforeWrite(row) {
    // Stamp the publish date the first time something goes live.
    if (row.status === "published" && !row.published_at) {
      return { ...row, published_at: new Date().toISOString() };
    }
    return row;
  },
});

export async function createProgram(input: unknown) {
  return actions.create(input);
}

export async function updateProgram(input: unknown) {
  return actions.update(input);
}

export async function deleteProgram(id: string) {
  return actions.remove(id);
}

export async function reorderPrograms(ids: string[]) {
  return actions.reorder(ids);
}
