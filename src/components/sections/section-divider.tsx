import { cn } from "@/lib/utils";

type SectionDividerProps = {
  /** Tailwind fill utility for the wave — set to the *next* section's surface. */
  fill?: string;
  flip?: boolean;
  className?: string;
};

/**
 * An organic wave transition between two stacked sections — softens hard color
 * boundaries in keeping with the brand's paper-cut language. Decorative.
 */
export function SectionDivider({
  fill = "fill-surface",
  flip = false,
  className,
}: SectionDividerProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none", className)}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={cn("block h-10 w-full sm:h-16", fill, flip && "rotate-180")}
      >
        <path d="M0 40C240 80 480 4 720 30s480 30 720 8v42H0z" />
      </svg>
    </div>
  );
}
