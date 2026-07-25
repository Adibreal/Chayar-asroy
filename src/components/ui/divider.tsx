import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Separator } from "./separator";

type DividerProps = {
  /** Optional centered label or motif shown within the rule. */
  label?: ReactNode;
  className?: string;
};

/**
 * A decorative section divider. Without a `label` it is a plain rule; with one,
 * it renders a centered, uppercased label flanked by lines — a warm, editorial
 * break between sections.
 */
export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <Separator className={className} />;
  }

  return (
    <div className={cn("flex items-center gap-4 text-muted-foreground", className)}>
      <span className="h-px flex-1 bg-border" />
      <span className="text-caption font-semibold tracking-[0.12em] uppercase">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
