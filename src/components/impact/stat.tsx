import { AnimatedCounter } from "../motion/animated-counter";
import { cn } from "@/lib/utils";

export type StatData = {
  /** Number → animated count-up; string → shown as-is. */
  value: number | string;
  label: string;
  prefix?: string;
  suffix?: string;
};

type StatProps = StatData & {
  align?: "start" | "center";
  className?: string;
};

/**
 * A single headline metric. Numeric values count up when scrolled into view
 * (respecting reduced motion); string values render as-is.
 */
export function Stat({ value, label, prefix, suffix, align = "center", className }: StatProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <span className="font-display text-h1 leading-none font-semibold text-primary">
        {prefix}
        {typeof value === "number" ? <AnimatedCounter value={value} /> : value}
        {suffix}
      </span>
      <span className="text-small font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
