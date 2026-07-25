"use server";

import { createEntityActions } from "@/server/actions/entity-actions";
import { storySchema, storyUpdateSchema } from "@/validation/content";

/** Story Server Actions — same factory, different table and schemas. */
const actions = createEntityActions({
  table: "stories",
  createSchema: storySchema,
  updateSchema: storyUpdateSchema,
  revalidate: ["/admin/stories", "/stories", "/"],
  beforeWrite(row) {
    if (row.status === "published" && !row.published_at) {
      return { ...row, published_at: new Date().toISOString() };
    }
    return row;
  },
});

export async function createStory(input: unknown) {
  return actions.create(input);
}

export async function updateStory(input: unknown) {
  return actions.update(input);
}

export async function deleteStory(id: string) {
  return actions.remove(id);
}
