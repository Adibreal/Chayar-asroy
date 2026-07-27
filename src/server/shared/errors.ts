import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Stable, machine-readable error codes. The UI switches on these rather than
 * on message strings, so wording can change freely.
 */
export const ERROR_CODES = [
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "VALIDATION",
  "CONFLICT",
  "STORAGE",
  "DATABASE",
  "UNKNOWN",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

/**
 * The single application error type. Carries a safe, user-facing `message`
 * plus optional field errors for forms.
 */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly fieldErrors?: Record<string, string[]>;
  /**
   * Original error, kept for server logs — never sent to the client.
   * Overrides the native `Error.cause` so it is typed and always populated.
   */
  override readonly cause?: unknown;

  constructor(
    code: ErrorCode,
    message: string,
    options?: { fieldErrors?: Record<string, string[]>; cause?: unknown },
  ) {
    super(message, { cause: options?.cause });
    this.name = "AppError";
    this.code = code;
    this.fieldErrors = options?.fieldErrors;
    this.cause = options?.cause;
  }
}

export const errors = {
  unauthenticated: (message = "You need to sign in to do that.") =>
    new AppError("UNAUTHENTICATED", message),
  forbidden: (message = "You don't have permission to do that.") =>
    new AppError("FORBIDDEN", message),
  notFound: (message = "That item could not be found.") => new AppError("NOT_FOUND", message),
  validation: (fieldErrors: Record<string, string[]>, message = "Please check the form.") =>
    new AppError("VALIDATION", message, { fieldErrors }),
  conflict: (message = "That conflicts with existing data.") => new AppError("CONFLICT", message),
  storage: (message = "The file could not be processed.", cause?: unknown) =>
    new AppError("STORAGE", message, { cause }),
} as const;

/**
 * Translate a PostgREST error into an `AppError`.
 *
 * Postgres error codes are mapped deliberately so callers never have to parse
 * database strings, and so RLS denials surface as FORBIDDEN rather than a
 * confusing empty result.
 */
export function fromPostgrestError(error: PostgrestError): AppError {
  switch (error.code) {
    case "PGRST116": // no rows returned by .single()
      return new AppError("NOT_FOUND", "That item could not be found.", { cause: error });
    case "23505": // unique_violation
      return new AppError("CONFLICT", "That already exists.", { cause: error });
    case "23503": // foreign_key_violation
      return new AppError("CONFLICT", "That item is still referenced by something else.", {
        cause: error,
      });
    case "42501": // insufficient_privilege (RLS)
      return new AppError("FORBIDDEN", "You don't have permission to do that.", { cause: error });
    case "P0001": {
      /**
       * raise_exception — a deliberate rule from one of our own triggers.
       *
       * Every P0001 in this schema carries a message we wrote for a human to
       * read (child-safety consent gate, role/activation guards), so passing it
       * through tells the editor what actually happened. The generic fallback
       * turned "this photo has no guardian consent" into "something went
       * wrong", which is precisely the wrong thing to say about child safety.
       *
       * INVARIANT: any `raise exception` added to a migration must carry a
       * message that is safe and meaningful to show a signed-in editor.
       */
      const message = error.message?.trim();
      return new AppError("FORBIDDEN", message || "That change isn't allowed.", { cause: error });
    }
    default:
      return new AppError("DATABASE", "Something went wrong saving your changes.", {
        cause: error,
      });
  }
}

/** Normalise anything thrown into an `AppError`. */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error) {
    return new AppError("UNKNOWN", "Something went wrong.", { cause: error });
  }
  return new AppError("UNKNOWN", "Something went wrong.", { cause: error });
}
