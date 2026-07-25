"use client";

import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { DropdownMenu } from "radix-ui";

import { Avatar } from "@/components/ui/avatar";
import { ROLE_LABELS } from "@/lib/permissions";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { signOut } from "@/server/auth/actions";
import type { Profile } from "@/types/database";

/**
 * Account menu: who you are, your role, a link to the live site, and sign out.
 *
 * Sign-out posts to the Server Action inside a plain `<form>`, so it works
 * without JavaScript and needs no client-side session juggling.
 */
export function UserMenu({ user }: { user: Profile }) {
  const displayName = user.full_name?.trim() || user.email;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-surface-hover",
            focusRing,
          )}
        >
          <Avatar alt={displayName} size="sm" src={user.avatar_url ?? undefined} />
          <span className="hidden text-small font-medium sm:inline">{displayName}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-[var(--z-dropdown)] w-60 animate-fade rounded-xl border border-border bg-card p-1.5 shadow-lg"
        >
          <div className="px-2.5 py-2">
            <p className="truncate text-small font-medium text-foreground">{displayName}</p>
            <p className="truncate text-caption text-muted-foreground">{user.email}</p>
            <p className="mt-1 inline-flex rounded-full bg-muted px-2 py-0.5 text-caption text-muted-foreground">
              {ROLE_LABELS[user.role]}
            </p>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          <DropdownMenu.Item asChild>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex cursor-default items-center gap-2 rounded-lg px-2.5 py-2 text-small outline-none data-[highlighted]:bg-surface-hover"
            >
              <ExternalLink className="size-4" aria-hidden />
              View live site
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          <DropdownMenu.Item asChild>
            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full cursor-default items-center gap-2 rounded-lg px-2.5 py-2 text-small text-danger outline-none data-[highlighted]:bg-danger-soft"
              >
                <LogOut className="size-4" aria-hidden />
                Sign out
              </button>
            </form>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
