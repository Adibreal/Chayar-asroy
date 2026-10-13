/**
 * Form input is camelCase; the database is snake_case. Converting
 * automatically removes a per-entity mapping function — and with it a whole
 * class of "I forgot to map that field" bugs.
 */
function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Map validated input to a database row payload.
 *
 * `undefined` is ambiguous after validation: `optionalText` turns an emptied
 * field into `undefined`, and so does a key the caller never sent. The two
 * must not be treated alike — an editor who empties "Location" expects it
 * gone, while a partial update (publishing a gallery item) must not wipe the
 * fields it didn't mention. Passing the raw `submitted` input tells them
 * apart: a key that was sent but validated to `undefined` becomes `null`,
 * which clears the column; a key that was never sent is left out.
 *
 * Without `submitted`, every `undefined` is dropped — right for inserts, where
 * an absent column takes its default.
 *
 * Kept free of `server-only` and Next imports so it can be exercised directly.
 */
export function toRowPayload(
  input: Record<string, unknown>,
  submitted?: unknown,
): Record<string, unknown> {
  const sent =
    submitted !== null && typeof submitted === "object"
      ? (submitted as Record<string, unknown>)
      : {};

  const row: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) {
      if (Object.hasOwn(sent, key)) row[camelToSnake(key)] = null;
      continue;
    }
    row[camelToSnake(key)] = value;
  }
  return row;
}
