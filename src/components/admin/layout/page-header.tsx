import type { ReactNode } from "react";

import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { cn } from "@/lib/utils";

/**
 * Standard heading block for every CMS page: title, optional description, and
 * a right-aligned actions slot (primary buttons, filters).
 *
 * Using this everywhere is what makes each new editor feel identical — the
 * `<h1>` is here, so pages never invent their own heading hierarchy.
 */
export function AdminPageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        {/* Sans, not the public site's display serif — the CMS reads as a tool. */}
        <Heading level={1} size="h3" className="font-sans">
          {title}
        </Heading>
        {description ? (
          <Text variant="small" tone="muted" className="max-w-2xl">
            {description}
          </Text>
        ) : null}
      </div>

      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
