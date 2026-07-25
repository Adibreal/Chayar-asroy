"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary for the CMS.
 *
 * Shows a calm, plain-language message and a retry — never a stack trace. The
 * digest is surfaced quietly so a volunteer can quote it when reporting an
 * issue.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="max-w-md space-y-4 text-center">
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-danger-soft text-danger">
          <TriangleAlert className="size-5" aria-hidden />
        </span>

        <div className="space-y-1.5">
          <h1 className="text-h5 font-semibold text-foreground">Something went wrong</h1>
          <p className="text-small text-muted-foreground">
            The page couldn&apos;t be loaded. Try again — if it keeps happening, let a maintainer
            know.
          </p>
        </div>

        <Button onClick={reset} size="sm">
          <RotateCcw className="size-4" aria-hidden />
          Try again
        </Button>

        {error.digest ? (
          <p className="text-caption text-muted-foreground">Reference: {error.digest}</p>
        ) : null}
      </div>
    </div>
  );
}
