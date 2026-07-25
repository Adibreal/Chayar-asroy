"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { easing } from "@/lib/motion/tokens";

/**
 * App-wide Motion configuration.
 *
 * `reducedMotion="user"` makes every Motion animation respect the user's
 * `prefers-reduced-motion` setting automatically — transform/opacity tweens
 * are neutralised without any per-component code.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: easing.brand }}>
      {children}
    </MotionConfig>
  );
}
