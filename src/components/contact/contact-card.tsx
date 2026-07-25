import type { ReactNode } from "react";

import { Card } from "../ui/card";
import { IconBadge } from "../ui/icon-badge";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

export type ContactItem = {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  /** Optional link (e.g. `mailto:`, `tel:`) — makes the whole card actionable. */
  href?: string;
};

/** A single contact method: icon, label, and value (optionally a link). */
export function ContactCard({
  icon,
  label,
  value,
  href,
  className,
}: ContactItem & { className?: string }) {
  return (
    <Card
      variant={href ? "interactive" : "base"}
      padding="md"
      className={cn("relative flex items-center gap-4", className)}
    >
      {icon ? <IconBadge size="sm">{icon}</IconBadge> : null}
      <div className="flex flex-col">
        <span className="text-small text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
      {href ? (
        <a
          href={href}
          aria-label={label}
          className={cn("absolute inset-0 rounded-2xl", focusRing)}
        />
      ) : null}
    </Card>
  );
}
