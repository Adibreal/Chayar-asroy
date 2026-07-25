import { cn } from "@/lib/utils";

type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  /** Decorative separators are hidden from assistive tech (the default). */
  decorative?: boolean;
  className?: string;
};

/**
 * A thin rule between content. Server-rendered and dependency-free. Set
 * `decorative={false}` when the separation is semantically meaningful.
 */
export function Separator({
  orientation = "horizontal",
  decorative = true,
  className,
}: SeparatorProps) {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
    />
  );
}
