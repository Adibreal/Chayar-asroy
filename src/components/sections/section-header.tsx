import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Heading } from "../typography/heading";
import { Text } from "../typography/text";

type SectionHeaderProps = {
  /** Small uppercase kicker above the title. */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  titleLevel?: 1 | 2 | 3 | 4;
  titleSize?: "hero" | "h1" | "h2" | "h3";
  /** Optional trailing control (e.g. a "View all" button). */
  action?: ReactNode;
  className?: string;
};

/**
 * Standardised heading block for any website section: kicker + title +
 * description, with optional trailing action. Keeps every section's rhythm and
 * type hierarchy consistent.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start",
  titleLevel = 2,
  titleSize = "h2",
  action,
  className,
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("flex max-w-2xl flex-col gap-3", centered && "items-center")}>
        {eyebrow ? (
          <Text variant="label" tone="primary">
            {eyebrow}
          </Text>
        ) : null}
        {/* Guarded: a CMS-driven section may legitimately have no title, and an
            empty <h2> is both a layout gap and a WCAG "empty heading" failure. */}
        {title ? (
          <Heading level={titleLevel} size={titleSize}>
            {title}
          </Heading>
        ) : null}
        {description ? (
          <Text variant="lead" tone="muted">
            {description}
          </Text>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/**
 * A prominent, centered section opener (larger title, lead description) — for
 * the top of a page section.
 */
export function SectionIntro({ titleSize = "h1", ...props }: SectionHeaderProps) {
  return <SectionHeader {...props} align="center" titleSize={titleSize} />;
}
