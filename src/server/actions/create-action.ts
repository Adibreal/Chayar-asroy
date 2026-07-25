import "server-only";

import { revalidatePath } from "next/cache";
import type { z } from "zod";

import { requireRole } from "@/server/auth/session";
import { AppError } from "@/server/shared/errors";
import { attempt, type Result } from "@/server/shared/result";
import type { Profile, UserRole } from "@/types/database";

type ActionConfig<TSchema extends z.ZodType, TResult> = {
  /** Zod schema the raw input must satisfy. */
  input: TSchema;
  /** Minimum role required. Omit only for genuinely public actions. */
  role?: UserRole;
  /** Paths to revalidate after a successful run. */
  revalidate?: string[];
  handler: (args: { input: z.infer<TSchema>; user: Profile | null }) => Promise<TResult>;
};

/**
 * Builds a Server Action with the same guarantees every time:
 *
 *   1. **Authorize** — enforce the minimum role (RLS still re-checks in the DB)
 *   2. **Validate** — parse input with Zod; field errors come back structured
 *   3. **Execute** — run the handler with typed input and the current user
 *   4. **Revalidate** — refresh affected routes
 *   5. **Normalize** — always resolve to a `Result`, never throw at the client
 *
 * Writing actions this way means no handler re-implements auth or validation,
 * and no action can accidentally skip them.
 *
 * @example
 * export const updateProgram = createAction({
 *   input: programUpdateSchema,
 *   role: "editor",
 *   revalidate: ["/programs"],
 *   handler: async ({ input }) => programs.update(input.id, mapProgram(input)),
 * });
 */
export function createAction<TSchema extends z.ZodType, TResult>(
  config: ActionConfig<TSchema, TResult>,
) {
  return async (rawInput: unknown): Promise<Result<TResult>> =>
    attempt(async () => {
      const user = config.role ? await requireRole(config.role) : null;

      const parsed = config.input.safeParse(rawInput);
      if (!parsed.success) {
        throw new AppError("VALIDATION", "Please check the highlighted fields.", {
          fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        });
      }

      const result = await config.handler({ input: parsed.data, user });

      for (const path of config.revalidate ?? []) {
        revalidatePath(path);
      }

      return result;
    });
}
