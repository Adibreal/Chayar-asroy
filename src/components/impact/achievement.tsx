import type { ReactNode } from "react";

import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import { IconBadge } from "../ui/icon-badge";
import { cn } from "@/lib/utils";

type AchievementHighlightProps = {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  className?: string;
};

/** Icon + title + description row for highlighting achievements or benefits. */
export function AchievementHighlight({
  icon,
  title,
  description,
  className,
}: AchievementHighlightProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      {icon ? <IconBadge>{icon}</IconBadge> : null}
      <div className="flex flex-col gap-1">
        <Heading level={3} size="h5">
          {title}
        </Heading>
        {description ? <Text tone="muted">{description}</Text> : null}
      </div>
    </div>
  );
}
