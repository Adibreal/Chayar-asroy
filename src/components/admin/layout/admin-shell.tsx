import Link from "next/link";
import type { ReactNode } from "react";

import { TreeMark } from "@/components/brand/logo";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";

import { Breadcrumbs } from "./breadcrumbs";
import { MobileSidebar } from "./mobile-sidebar";
import { SidebarNav } from "./sidebar-nav";
import { UserMenu } from "./user-menu";

/**
 * The one CMS layout. Every admin page renders inside it, so navigation,
 * breadcrumbs and the account menu are defined exactly once.
 *
 * A Server Component: only the genuinely interactive leaves (nav active state,
 * drawer, dropdown) are client-side.
 *
 * `.admin` retunes the semantic design tokens to the CMS's calmer palette —
 * see the ADMIN THEME block in `globals.css`.
 */
export function AdminShell({ user, children }: { user: Profile; children: ReactNode }) {
  return (
    <div className="admin min-h-dvh bg-background text-foreground">
      <a
        href="#admin-content"
        className={cn(
          "sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground",
          "focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[var(--z-toast)]",
        )}
      >
        Skip to content
      </a>

      <div className="lg:grid lg:grid-cols-[16rem_1fr]">
        {/* Desktop sidebar — sticky, independently scrollable */}
        <aside className="sticky top-0 hidden h-dvh flex-col gap-6 overflow-y-auto border-r border-border bg-surface p-4 lg:flex">
          <Link
            href="/admin"
            className={cn("flex items-center gap-2 rounded-lg px-1 py-1", focusRing)}
          >
            <TreeMark className="size-7 shrink-0" />
            <span className="text-small font-semibold">Chayar Asroy CMS</span>
          </Link>

          <SidebarNav role={user.role} />
        </aside>

        <div className="flex min-w-0 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-[var(--z-header)] flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm sm:px-6">
            <MobileSidebar role={user.role} />
            <Breadcrumbs className="min-w-0 flex-1" />
            <UserMenu user={user} />
          </header>

          <main id="admin-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
