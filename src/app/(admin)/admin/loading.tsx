import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route-level loading state. Mirrors the dashboard's shape so navigation feels
 * instant and nothing jumps when the real content arrives.
 */
export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading">
      <div className="space-y-2 border-b border-border pb-5">
        <Skeleton variant="text" className="h-7 w-52" />
        <Skeleton variant="text" className="w-72" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} variant="block" className="h-28" />
        ))}
      </div>

      <Skeleton variant="block" className="h-64" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
