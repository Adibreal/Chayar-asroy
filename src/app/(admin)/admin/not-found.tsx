import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Not-found inside the CMS — stays within the shell so navigation is retained. */
export default function AdminNotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-h3 font-semibold text-primary">404</p>
        <div className="space-y-1.5">
          <h1 className="text-h5 font-semibold text-foreground">Page not found</h1>
          <p className="text-small text-muted-foreground">
            That CMS page doesn&apos;t exist, or it hasn&apos;t been built yet.
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/admin">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
