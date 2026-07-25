import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Our custom font-size scale (see the `--text-*` tokens in `globals.css`).
 *
 * tailwind-merge must be told these are **font sizes**. Left to its own
 * heuristics it reads `text-display` as a *colour* utility, decides it conflicts
 * with `text-primary`, and silently drops one of them — so `cn("text-display
 * text-primary")` would render at the base 16px with no error anywhere. That
 * bit us on the impact numbers; registering the scale here fixes it for every
 * component at once.
 *
 * Keep in sync with the `--text-*` entries in `globals.css`.
 */
const FONT_SIZES = [
  "display",
  "hero",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "lead",
  "body",
  "small",
  "caption",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...FONT_SIZES] }],
    },
  },
});

/**
 * Merge conditional class names and resolve conflicting Tailwind utilities
 * (last one wins), e.g. `cn("px-2", condition && "px-4")` → `"px-4"`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
