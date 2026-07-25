import { Stagger } from "../motion/stagger";
import { cn } from "@/lib/utils";

import { Stat, type StatData } from "./stat";

/** A row/grid of headline metrics that reveal with a stagger. */
export function ImpactMetrics({ stats, className }: { stats: StatData[]; className?: string }) {
  return (
    <Stagger className={cn("grid grid-cols-2 gap-8 sm:grid-cols-4", className)}>
      {stats.map((stat) => (
        <Stat key={stat.label} {...stat} />
      ))}
    </Stagger>
  );
}
