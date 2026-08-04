/**
 * Split a multi-line textarea value into trimmed, non-empty lines.
 *
 * The CMS collects short ordered lists (donation methods, programme
 * objectives, volunteer credits) as one-per-line text, because a textarea is
 * the least fiddly control for a volunteer editor. This is the single place
 * that turns that convention into an array — both the Zod schemas that write it
 * and the content layer that reads it use this function.
 */
export function toLines(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Join a list back into the one-per-line form the CMS textareas expect. */
export function fromLines(values: readonly string[] | null | undefined): string {
  return (values ?? []).join("\n");
}
