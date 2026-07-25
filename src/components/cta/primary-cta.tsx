import Link from "next/link";
import type { ComponentProps } from "react";

import { siteConfig } from "@/config/site";

import { Button } from "../ui/button";

type PrimaryCtaProps = {
  size?: ComponentProps<typeof Button>["size"];
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
  /** Forwarded to the link — e.g. to close the mobile drawer after a tap. */
  onClick?: () => void;
};

/**
 * The single, configurable primary call-to-action, sourced from
 * `siteConfig.primaryCta`. Reused by the navbar, hero, and campaign band so the
 * organisation's current priority action has ONE source of truth — change the
 * label/href in one place. Renders nothing when `enabled` is false (e.g.
 * between campaigns), so callers don't need their own visibility checks.
 */
export function PrimaryCta({
  size = "md",
  variant = "primary",
  className,
  onClick,
}: PrimaryCtaProps) {
  const cta = siteConfig.primaryCta;
  if (!cta.enabled) return null;

  return (
    <Button asChild size={size} variant={variant} className={className}>
      <Link href={cta.href} onClick={onClick}>
        {cta.label}
      </Link>
    </Button>
  );
}
