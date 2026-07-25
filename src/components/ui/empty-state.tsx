import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Heading } from "../typography/heading";
import { Text } from "../typography/text";

type EmptyStateProps = {
  /** Icon or brand motif shown above the title (sized to ~2.5rem). */
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  /** Optional call-to-action (e.g. a Button). */
  action?: ReactNode;
  className?: string;
};

/**
 * Friendly placeholder for empty lists, no-results, and first-run states —
 * keeps the tone warm rather than clinical.
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? <div className="mb-1 text-muted-foreground [&_svg]:size-10">{icon}</div> : null}
      <Heading level={3} size="h5">
        {title}
      </Heading>
      {description ? (
        <Text tone="muted" className="max-w-sm">
          {description}
        </Text>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
