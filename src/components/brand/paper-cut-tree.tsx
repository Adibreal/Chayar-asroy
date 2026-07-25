import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

/**
 * The fully-detailed paper-cut tree — the illustrative sibling of `TreeMark`.
 *
 * Evolves the official logo's language for the web: layered canopies with
 * offset shadows (the paper-cut depth), a curving trunk, the little sheltered
 * house, and floral tufts. Used as brand artwork in large empty image slots and
 * hero compositions, where the extra detail can breathe.
 *
 * Decorative by default (`aria-hidden`); tinted entirely from brand tokens.
 */
export function PaperCutTree({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 118"
      className={cn("w-32", className)}
      fill="none"
      aria-hidden
      focusable={false}
      {...props}
    >
      {/* Trunk */}
      <path
        d="M58 112C58 98 50 92 53 82 56 72 65 66 62 54 60 44 57 38 60 28"
        className="stroke-forest"
        strokeWidth={7}
        strokeLinecap="round"
      />

      {/* Leaves along the trunk */}
      <ellipse
        cx="68"
        cy="47"
        rx="6"
        ry="2.6"
        className="fill-marigold"
        transform="rotate(-24 68 47)"
      />
      <ellipse
        cx="70"
        cy="52"
        rx="5"
        ry="2.2"
        className="fill-marigold"
        transform="rotate(-12 70 52)"
      />

      {/* Top tier */}
      <ellipse cx="63" cy="34" rx="44" ry="11.5" className="fill-ink/50" />
      <ellipse cx="61" cy="30" rx="44" ry="11.5" className="fill-marigold" />

      {/* Middle tier (terracotta) */}
      <ellipse cx="39" cy="65.5" rx="28" ry="8" className="fill-ink/50" />
      <ellipse cx="37" cy="62" rx="28" ry="8" className="fill-terracotta" />

      {/* The sheltered house, resting on the middle tier */}
      <path d="M24 56v-9h13v9z" className="fill-marigold" />
      <path d="M21 48l9.5-7.5L40 48z" className="fill-marigold" />
      <path d="M29 56v-5h4v5z" className="fill-terracotta" />

      {/* Bottom tier */}
      <ellipse cx="56" cy="89.5" rx="34" ry="9.5" className="fill-ink/50" />
      <ellipse cx="54" cy="86" rx="34" ry="9.5" className="fill-marigold" />

      {/* Floral tufts */}
      <g className="fill-terracotta">
        <ellipse cx="80" cy="78" rx="2.4" ry="4.2" />
        <ellipse cx="80" cy="78" rx="2.4" ry="4.2" transform="rotate(60 80 78)" />
        <ellipse cx="80" cy="78" rx="2.4" ry="4.2" transform="rotate(120 80 78)" />
      </g>
      <g className="fill-terracotta">
        <ellipse cx="20" cy="79" rx="2" ry="3.4" />
        <ellipse cx="20" cy="79" rx="2" ry="3.4" transform="rotate(60 20 79)" />
        <ellipse cx="20" cy="79" rx="2" ry="3.4" transform="rotate(120 20 79)" />
      </g>
    </svg>
  );
}
