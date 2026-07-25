import type { ReactNode } from "react";

import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import { Card } from "../ui/card";
import { IconBadge } from "../ui/icon-badge";
import { cn } from "@/lib/utils";

type OpportunityCardProps = {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  className?: string;
};

/** A volunteer role/opportunity: icon, title, and short description. */
export function OpportunityCard({ icon, title, description, className }: OpportunityCardProps) {
  return (
    <Card variant="base" padding="lg" className={cn("flex h-full flex-col gap-3", className)}>
      {icon ? <IconBadge>{icon}</IconBadge> : null}
      <Heading level={3} size="h5">
        {title}
      </Heading>
      {description ? <Text tone="muted">{description}</Text> : null}
    </Card>
  );
}
