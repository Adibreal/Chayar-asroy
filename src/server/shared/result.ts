import { type AppError, type ErrorCode, toAppError } from "./errors";

/**
 * The single shape every Server Action and repository returns.
 *
 * Errors are values, not exceptions, so callers must handle failure and
 * nothing leaks a stack trace to the browser. Discriminated on `ok`, so
 * TypeScript narrows `data`/`error` automatically.
 */
export type Result<T> = { ok: true; data: T } | { ok: false; error: SerializableError };

/**
 * Error shape safe to cross the server/client boundary — plain data only, so
 * it survives React Server Component serialisation.
 */
export type SerializableError = {
  code: ErrorCode;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function fail(error: AppError): Result<never> {
  return {
    ok: false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
    },
  };
}

/**
 * Run an operation and convert any throw into a failed `Result`.
 * Logs the underlying cause server-side; the client only sees a safe message.
 */
export async function attempt<T>(operation: () => Promise<T>): Promise<Result<T>> {
  try {
    return ok(await operation());
  } catch (caught) {
    const error = toAppError(caught);
    if (error.code === "DATABASE" || error.code === "UNKNOWN") {
      console.error("[server]", error.message, error.cause ?? caught);
    }
    return fail(error);
  }
}
