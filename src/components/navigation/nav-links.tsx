"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

type NavLinksProps = {
  /**
   * Navigation from the CMS. Items marked `available: false` are filtered out
   * (route not built yet), and an empty result renders nothing at all.
   */
  items: readonly { label: string; href: string; available?: boolean }[];
  orientation?: "horizontal" | "vertical";
  /** Called after a link is chosen — used to close the mobile menu. */
  onNavigate?: () => void;
  className?: string;
};

/** Primary navigation links with active-route highlighting. */
export function NavLinks({
  items,
  orientation = "horizontal",
  onNavigate,
  className,
}: NavLinksProps) {
  const pathname = usePathname();

  // Never advertise a page that doesn't exist yet.
  const visible = items.filter((item) => item.available !== false);
  if (visible.length === 0) return null;

  return (
    <ul
      className={cn(
        orientation === "horizontal" ? "flex items-center gap-1" : "flex flex-col gap-1",
        className,
      )}
    >
      {visible.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex items-center rounded-md px-3 py-2 font-medium transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-foreground",
                focusRing,
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
