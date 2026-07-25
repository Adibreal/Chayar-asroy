"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * `true` when the user has requested reduced motion at the OS level.
 *
 * Prefer Motion's built-in handling (`MotionConfig reducedMotion="user"`) for
 * animations. Use this hook for non-Motion cases — e.g. deciding whether to
 * autoplay a video or run a canvas effect.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
