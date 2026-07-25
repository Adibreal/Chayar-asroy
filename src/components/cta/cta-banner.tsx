import type { ReactNode } from "react";

import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import { cn } from "@/lib/utils";

type CTABannerProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/**
 * A lighter, inline secondary CTA — text on one side, an action on the other,
 * stacking on mobile.
 */
export function CTABanner({ title, description, action, className }: CTABannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <Heading level={2} size="h4">
          {title}
        </Heading>
        {description ? <Text tone="muted">{description}</Text> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
