import type { ReactNode } from "react";

import { SocialLinks, type SocialLink } from "../navigation/social-links";
import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import { cn } from "@/lib/utils";

/**
 * A "reach us on social" block — heading, a short prompt, and social icon links.
 * Reflects the organisation's real "inbox our page" flow.
 */
export function SocialContact({
  title = "Follow our journey",
  description = "Message us on Instagram for collection details, volunteering, or just to say hello.",
  items,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  items?: SocialLink[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Heading level={2} size="h4">
        {title}
      </Heading>
      {description ? <Text tone="muted">{description}</Text> : null}
      <SocialLinks items={items} />
    </div>
  );
}
