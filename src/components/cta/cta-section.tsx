import type { ReactNode } from "react";

import { Blob, Spiral, Star } from "../brand/motifs";
import { Cluster } from "../layout/cluster";
import { DecorativeLayer } from "../sections/backgrounds";
import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import { cn } from "@/lib/utils";

type CTASectionProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Optional extra content between description and actions (e.g. badges). */
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/**
 * The primary call-to-action band: cobalt field, centered message, decorative
 * motifs. Pass action buttons via `actions` (use high-contrast variants on the
 * cobalt background, e.g. `secondary` or a marigold custom button).
 */
export function CTASection({
  eyebrow,
  title,
  description,
  children,
  actions,
  className,
}: CTASectionProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground sm:px-12 sm:py-20",
        className,
      )}
    >
      <DecorativeLayer>
        <Blob className="absolute -top-16 -right-16 size-72 text-white/5" />
        <Star className="absolute top-10 left-[8%] size-8 text-marigold/70" />
        <Spiral className="absolute right-[12%] bottom-8 size-10 text-white/15" />
      </DecorativeLayer>

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        {eyebrow ? (
          <Text variant="label" className="text-primary-foreground/80">
            {eyebrow}
          </Text>
        ) : null}
        <Heading level={2} size="h1" className="text-primary-foreground">
          {title}
        </Heading>
        {description ? (
          <Text variant="lead" className="text-primary-foreground/85">
            {description}
          </Text>
        ) : null}
        {children}
        {actions ? (
          <Cluster gap="sm" justify="center" className="pt-2">
            {actions}
          </Cluster>
        ) : null}
      </div>
    </div>
  );
}
