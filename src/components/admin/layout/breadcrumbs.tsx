"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNavIndex } from "@/config/admin-nav";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

/** Turn a URL segment into a readable label ("site-settings" → "Site settings"). */
function humanize(segment: string): string {
  const text = segment.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Breadcrumbs derived from the URL, so no page has to declare its own trail.
 *
 * Labels come from the nav config when a path is known, otherwise from the
 * segment itself — which means dynamic routes (`/admin/programs/[id]`) still
 * read sensibly. The last crumb is the current page and is not a link.
 */
export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Nothing useful to show at the CMS root.
  if (segments.length <= 1) return null;

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const known = adminNavIndex.find((item) => item.href === href);
    return {
      href,
      label: index === 0 ? "Dashboard" : (known?.label ?? humanize(segment)),
    };
  });

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-caption text-muted-foreground">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {index > 0 ? <ChevronRight className="size-3.5 shrink-0" aria-hidden /> : null}
              {isLast ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className={cn("rounded transition-colors hover:text-foreground", focusRing)}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
