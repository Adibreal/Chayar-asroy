import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
} as const;

type SpinnerProps = SVGProps<SVGSVGElement> & {
  size?: keyof typeof sizes;
};

/**
 * Decorative loading spinner (aria-hidden). For standalone loading states,
 * wrap it in an element with `role="status"` and visually-hidden label text so
 * screen readers are informed; `Button` sets `aria-busy` instead.
 *
 * Under `prefers-reduced-motion`, the global CSS reset halts the spin.
 */
export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("animate-spin", sizes[size], className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
