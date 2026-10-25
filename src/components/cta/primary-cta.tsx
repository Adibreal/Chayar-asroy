"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

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
 * Scroll to an anchor on the page we are already on, instead of handing the
 * click to the router.
 *
 * The CTA links to `/#how-to-help`. Clicked on the homepage itself, that is a
 * hash-only navigation, which Next 16 performs with the page's
 * `scroll-behavior: smooth` still applied — and in practice the URL changed
 * while the page barely moved, so the button looked dead. Doing the one scroll
 * ourselves takes the router out of it. Links to another page (a programme
 * page's CTA → the homepage section) still go through the router, which lands
 * on the anchor reliably thanks to `data-scroll-behavior` on `<html>`.
 */
function scrollToAnchorOnThisPage(event: MouseEvent<HTMLAnchorElement>, href: string) {
  const url = new URL(href, window.location.href);
  const samePage =
    url.origin === window.location.origin && url.pathname === window.location.pathname;
  if (!samePage || !url.hash) return;

  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;

  event.preventDefault();
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
  // Next frame: closing the mobile drawer (the `onClick` above) has to release
  // its scroll lock first, or the scroll is swallowed.
  requestAnimationFrame(() => target.scrollIntoView({ behavior, block: "start" }));
}

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
      <Link
        href={cta.href}
        onClick={(event) => {
          onClick?.();
          scrollToAnchorOnThisPage(event, cta.href);
        }}
      >
        {cta.label}
      </Link>
    </Button>
  );
}
