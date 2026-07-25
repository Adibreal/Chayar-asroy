import type { SVGProps } from "react";

/**
 * Brand motifs — the Chayar Asroy decorative language, drawn from the tree
 * logo and the hand-crafted campaign posters (spiral, star, sun, leaf, sprout,
 * squiggle, blob).
 *
 * Conventions:
 * - Single-color, using `currentColor` — tint with `text-*` tokens.
 * - Sized via `className` (e.g. `size-8`) or width/height props.
 * - Decorative by default (`aria-hidden`). For meaningful use, pass
 *   `role="img"` + `aria-label` and remove `aria-hidden` via props.
 * - Used sparingly as punctuation — never as wallpaper (see DESIGN_SYSTEM.md).
 *
 * These are a working, refinable set; final artwork will be reconciled against
 * the official vector logo.
 */

type MotifProps = SVGProps<SVGSVGElement>;

const base = {
  "aria-hidden": true,
  focusable: false,
} as const;

export function Spiral(props: MotifProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...base}
      {...props}
    >
      <path d="M12 12c0-1 1-1.6 1.9-1.1 1.1.6 1.2 2.2.3 3.1-1.1 1.2-3 1.1-4.1-.1-1.3-1.5-1.2-3.9.4-5.2 1.8-1.6 4.7-1.4 6.4.5" />
    </svg>
  );
}

export function Star(props: MotifProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" {...base} {...props}>
      <path d="M12 2.2l2.7 6.1 6.6.6-5 4.4 1.5 6.5L12 16.9l-5.8 3.9 1.5-6.5-5-4.4 6.6-.6z" />
    </svg>
  );
}

export function Sun(props: MotifProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...base} {...props}>
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <g stroke="currentColor" strokeWidth={1.9} strokeLinecap="round">
        <path d="M12 1.8v2.4M12 19.8v2.4M22.2 12h-2.4M4.2 12H1.8M19.2 4.8l-1.7 1.7M6.5 17.5l-1.7 1.7M19.2 19.2l-1.7-1.7M6.5 6.5 4.8 4.8" />
      </g>
    </svg>
  );
}

export function Leaf(props: MotifProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" {...base} {...props}>
      <path d="M12 21c-4.4 0-8-3.6-8-8 0-6 8-11 8-11s8 5 8 11c0 4.4-3.6 8-8 8z" />
    </svg>
  );
}

export function Sprout(props: MotifProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...base} {...props}>
      <path d="M12 21v-7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path d="M12 14.5c-3 0-6-2-6-5.2 3.2 0 6 2 6 5.2z" fill="currentColor" />
      <path d="M12 12.5c0-3.2 3-5.2 6-5.2 0 3.2-3 5.2-6 5.2z" fill="currentColor" />
    </svg>
  );
}

export function Squiggle(props: MotifProps) {
  return (
    <svg
      viewBox="0 0 120 12"
      width={120}
      height={12}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      {...base}
      {...props}
    >
      <path d="M2 7c10-6 20 6 30 0s20-6 30 0 20 6 30 0 18-5 26-3" />
    </svg>
  );
}

export function Blob(props: MotifProps) {
  return (
    <svg viewBox="0 0 200 200" width={200} height={200} fill="currentColor" {...base} {...props}>
      <path d="M155 55c18 22 21 54 5 77s-51 31-80 23-53-33-52-63 29-58 59-62 51 2 68 25z" />
    </svg>
  );
}

/** Five-petal paper-cut flower — echoes the floral tufts on the poster artwork. */
export function Flower(props: MotifProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...base} {...props}>
      <g fill="currentColor">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="12"
            cy="6.6"
            rx="2.8"
            ry="4.2"
            transform={`rotate(${angle} 12 12)`}
          />
        ))}
      </g>
      <circle cx="12" cy="12" r="2.6" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

/** A slender branch with paper-cut leaves — for soft, layered section corners. */
export function Branch(props: MotifProps) {
  return (
    <svg viewBox="0 0 64 28" width={64} height={28} fill="none" {...base} {...props}>
      <path
        d="M2 24C14 24 24 19 32 12 40 5 52 3 62 3"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <ellipse cx="16" cy="18" rx="5" ry="2.6" fill="currentColor" transform="rotate(-18 16 18)" />
      <ellipse
        cx="30"
        cy="11.5"
        rx="5.5"
        ry="2.8"
        fill="currentColor"
        transform="rotate(-32 30 11.5)"
      />
      <ellipse cx="45" cy="6" rx="5" ry="2.6" fill="currentColor" transform="rotate(-18 45 6)" />
      <ellipse
        cx="24"
        cy="19"
        rx="4"
        ry="2.2"
        fill="currentColor"
        opacity="0.7"
        transform="rotate(24 24 19)"
      />
    </svg>
  );
}
