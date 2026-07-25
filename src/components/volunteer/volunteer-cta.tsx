import type { ReactNode } from "react";

import { CTASection } from "../cta/cta-section";
import { Cluster } from "../layout/cluster";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { VOLUNTEER_ROLES } from "@/types";

type Role = { value: string; label: string };

/**
 * Volunteer recruitment CTA — mirrors the organisation's real "We are
 * recruiting volunteers" campaign, listing open roles as badges over the
 * primary CTA field.
 */
export function VolunteerCTA({
  title = "We are recruiting volunteers",
  description = "Lend your skills and help create a brighter future for children across Bangladesh.",
  roles = VOLUNTEER_ROLES,
  action,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  roles?: readonly Role[];
  action?: ReactNode;
  className?: string;
}) {
  return (
    <CTASection
      eyebrow="Get Involved"
      title={title}
      description={description}
      actions={action}
      className={className}
    >
      <Cluster gap="sm" justify="center">
        {roles.map((role) => (
          <Badge
            key={role.value}
            variant="outline"
            size="md"
            className={cn("border-white/40 text-primary-foreground")}
          >
            {role.label}
          </Badge>
        ))}
      </Cluster>
    </CTASection>
  );
}
