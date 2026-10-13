"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui";

/**
 * Public error page — shown inside the site's header and footer when a page
 * fails to render, instead of Next's unstyled default. Matches `not-found.tsx`
 * so an error still feels like part of the site, and offers a retry because
 * most failures here are a passing network or database hiccup.
 */
export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[public]", error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-5 py-24 text-center">
      <h1 className="font-display text-3xl text-foreground">Something went wrong</h1>
      <p className="max-w-prose text-muted-foreground">
        This page couldn’t load just now. Please try again in a moment.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}
