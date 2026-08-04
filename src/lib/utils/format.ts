/**
 * Formats a `YYYY-MM-DD` programme date for display.
 *
 * The locale is pinned rather than taken from the runtime: these pages are
 * statically prerendered, so a build-time locale could differ from the reader's
 * and produce a hydration mismatch. `en-GB` matches the site's English copy and
 * the day-first convention used in Bangladesh.
 *
 * Returns `null` for missing or unparseable input so callers can simply omit
 * the field rather than render "Invalid Date".
 */
export function formatEventDate(value: string | null | undefined): string | null {
  if (!value) return null;

  // Parse as a plain calendar date. Appending the time keeps it out of UTC
  // shifting, which can roll a date back a day in negative offsets.
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
