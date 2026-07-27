import Link from "next/link";
import type { ComponentProps } from "react";

import type { SiteCta } from "@/server/content/site";

import { Button } from "../ui/button";

type PrimaryCtaProps = {
  /** The CMS's `primaryCta`. Nothing renders when absent or disabled. */
  cta: SiteCta | null;
  size?: ComponentProps<typeof Button>["size"];
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
  /** Forwarded to the link — e.g. to close the mobile drawer after a tap. */
  onClick?: () => void;
};

/**
 * The single primary call-to-action, edited once in Site settings and reused by
 * the navbar, hero, mobile drawer and campaign band — so the organisation's
 * current priority action has ONE source of truth.
 *
 * Renders nothing when the CTA is absent or `enabled` is false (e.g. between
 * campaigns), so callers never need their own visibility checks.
 */
export function PrimaryCta({
  cta,
  size = "md",
  variant = "primary",
  className,
  onClick,
}: PrimaryCtaProps) {
  if (!cta?.enabled) return null;

  return (
    <Button asChild size={size} variant={variant} className={className}>
      <Link href={cta.href} onClick={onClick}>
        {cta.label}
      </Link>
    </Button>
  );
}
