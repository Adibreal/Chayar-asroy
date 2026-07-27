import Image from "next/image";
import type { SVGProps } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The Chayar Asroy tree mark — a web-optimised, simplified rendition of the
 * official logo: three tiered paper-cut canopies (marigold · terracotta ·
 * marigold), each with an offset shadow, growing along a curving forest trunk.
 *
 * Simplified deliberately so it stays crisp from 24px (navbar, favicon) upward;
 * `PaperCutTree` is the fully-detailed illustrative variant. Colors come from
 * brand tokens, so it adapts with the theme.
 *
 * For pixel-perfect fidelity, drop the official vector into `public/brand/`
 * and swap this component's internals (see public/brand/README.md).
 */
export function TreeMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-8", className)}
      fill="none"
      aria-hidden
      focusable={false}
      {...props}
    >
      {/* Trunk — drawn first so the canopies layer over it */}
      <path
        d="M20.4 37c0-4.8-3.6-6.6-3.2-10.4.4-3.8 4.2-4.6 3.9-8.4-.3-3.5-1.2-5.2-.8-8.4"
        className="stroke-forest"
        strokeWidth={3.2}
        strokeLinecap="round"
      />

      {/* Top tier */}
      <ellipse cx="20.6" cy="11.1" rx="13" ry="3.8" className="fill-ink/55" />
      <ellipse cx="20" cy="9.8" rx="13" ry="3.8" className="fill-marigold" />

      {/* Middle tier */}
      <ellipse cx="13.4" cy="21.2" rx="8.4" ry="2.8" className="fill-ink/55" />
      <ellipse cx="12.8" cy="19.9" rx="8.4" ry="2.8" className="fill-terracotta" />

      {/* Bottom tier */}
      <ellipse cx="17.4" cy="28.6" rx="10.2" ry="3.2" className="fill-ink/55" />
      <ellipse cx="16.8" cy="27.3" rx="10.2" ry="3.2" className="fill-marigold" />
    </svg>
  );
}

type LogoProps = {
  /** `full` shows the wordmark; `mark` is the tree only. */
  variant?: "full" | "mark";
  /** Organisation name from the CMS — used as the artwork's alt text. */
  name?: string;
  /** Bengali wordmark from the CMS, shown by the no-artwork fallback. */
  nameBn?: string | null;
  className?: string;
};

/**
 * Brand lockup. Renders the **official logo artwork** when `siteConfig.logo`
 * is configured; otherwise falls back to the tree mark paired with the Bengali
 * wordmark — the branding is never shown in English.
 *
 * The artwork itself stays a repo asset (it is a committed file, not a database
 * row), but the *names* come from the CMS so alt text and the Bengali wordmark
 * follow site settings. Defaults keep the component usable standalone, e.g. in
 * the design-system showcase.
 *
 * Presentational — wrap in a `<Link>` for navigation (the Header does this).
 */
export function Logo({
  variant = "full",
  name = siteConfig.fallback.name,
  nameBn = siteConfig.fallback.nameBn,
  className,
}: LogoProps) {
  const asset = siteConfig.logo;

  if (asset) {
    // Height-driven sizing preserves the aspect ratio; sized for the h-16/h-20
    // navbar (~40px mobile, ~48px desktop) with balanced vertical padding.
    //
    // `self-start` + `object-contain` guard the ratio in flex-column parents
    // (e.g. the footer), where the default `align-items: stretch` would
    // otherwise blow `w-auto` out to the full column width and squash the
    // artwork. `max-w-full` keeps it inside very narrow columns.
    const sizing = cn("h-10 w-auto max-w-full self-start object-contain sm:h-12", className);

    // Vectors are already crisp and tiny, so `next/image` adds nothing — render
    // the SVG directly. Because of this branch, swapping the PNG for an official
    // SVG later needs only the `siteConfig.logo.src` change: no edits here.
    if (asset.src.toLowerCase().endsWith(".svg")) {
      // eslint-disable-next-line @next/next/no-img-element -- intentional for a static, unoptimizable SVG logo
      return <img src={asset.src} alt={name} className={sizing} />;
    }

    return (
      <Image
        src={asset.src}
        alt={name}
        width={asset.width}
        height={asset.height}
        priority
        className={sizing}
      />
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <TreeMark className="size-9 shrink-0 sm:size-10" />
      {variant === "full" ? (
        <span lang="bn" className="text-h5 leading-tight font-semibold text-foreground">
          {nameBn}
        </span>
      ) : null}
    </span>
  );
}
