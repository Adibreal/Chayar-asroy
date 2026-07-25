"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { type AdminNavItem, adminNav } from "@/config/admin-nav";
import { hasRole } from "@/lib/permissions";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/database";

import { adminIcons } from "./icons";

/**
 * The CMS menu, rendered from `adminNav` config.
 *
 * Shared by the desktop sidebar and the mobile drawer so there is exactly one
 * navigation implementation. Items above the user's role are hidden, and items
 * whose editors don't exist yet render as non-interactive "Soon" rows — visible
 * so the shape of the CMS is legible, but never a dead link.
 */
export function SidebarNav({ role, onNavigate }: { role: UserRole; onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (item: AdminNavItem) =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

  return (
    <nav aria-label="CMS sections" className="flex flex-col gap-6">
      {adminNav.map((section, index) => {
        const visible = section.items.filter(
          (item) => !item.minRole || hasRole(role, item.minRole),
        );
        if (visible.length === 0) return null;

        return (
          <div key={section.title ?? `section-${index}`} className="flex flex-col gap-1">
            {section.title ? (
              <h2 className="px-3 pb-1 text-caption font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                {section.title}
              </h2>
            ) : null}

            <ul className="flex flex-col gap-0.5">
              {visible.map((item) => {
                const Icon = adminIcons[item.icon];
                const active = isActive(item);
                const disabled = item.enabled === false;

                if (disabled) {
                  return (
                    <li key={item.href}>
                      <span
                        aria-disabled="true"
                        title="Available in a later phase"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-small text-muted-foreground/70"
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[0.65rem] font-medium">
                          Soon
                        </span>
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-small font-medium transition-colors",
                        active
                          ? "bg-primary-soft text-primary"
                          : "text-foreground hover:bg-surface-hover",
                        focusRing,
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
