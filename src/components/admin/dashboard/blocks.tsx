import Link from "next/link";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

/**
 * Dashboard building blocks — deliberately generic containers rather than
 * analytics. Any future widget composes these, so the dashboard grows without
 * new layout code.
 */

/** Standard wrapper for any dashboard panel: title, optional action, body. */
export function Widget({
  title,
  action,
  className,
  children,
}: {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Card variant="base" className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <h2 className="text-small font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      <div className="flex-1 p-5">{children}</div>
    </Card>
  );
}

/** Single headline number with an optional hint. */
export function SummaryCard({
  label,
  value,
  hint,
  icon,
  href,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-small text-muted-foreground">{label}</span>
        {icon ? <span className="text-muted-foreground [&_svg]:size-4">{icon}</span> : null}
      </div>
      <p className="mt-2 text-h3 font-semibold text-foreground tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-caption text-muted-foreground">{hint}</p> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "block rounded-xl border border-border bg-card p-5 transition-colors hover:bg-surface-hover",
          focusRing,
        )}
      >
        {body}
      </Link>
    );
  }

  return (
    <Card variant="base" padding="md">
      {body}
    </Card>
  );
}

/** Prominent shortcuts to the tasks volunteers perform most. */
export function QuickAction({
  href,
  label,
  description,
  icon,
}: {
  href: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-surface-hover",
        focusRing,
      )}
    >
      {icon ? (
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary [&_svg]:size-4">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="block text-small font-medium text-foreground">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-caption text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </Link>
  );
}

/** Responsive grid for summary cards / quick actions. */
export function WidgetGrid({
  columns = 3,
  children,
}: {
  columns?: 2 | 3 | 4;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
      )}
    >
      {children}
    </div>
  );
}

/** Loading placeholder matching a widget's shape, to avoid layout shift. */
export function WidgetSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} variant="text" className="w-full" />
      ))}
    </div>
  );
}
