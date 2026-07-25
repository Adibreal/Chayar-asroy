import type { ReactNode } from "react";

import { AchievementHighlight } from "../impact/achievement";
import { cn } from "@/lib/utils";

type Highlight = {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
};

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
} as const;

/** Grid of reasons/benefits to volunteer, built from achievement highlights. */
export function VolunteerHighlights({
  items,
  columns = 3,
  className,
}: {
  items: Highlight[];
  columns?: keyof typeof columnClasses;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-8", columnClasses[columns], className)}>
      {items.map((item) => (
        <AchievementHighlight key={item.title} {...item} />
      ))}
    </div>
  );
}
