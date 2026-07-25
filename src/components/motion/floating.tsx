"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { floatingTransition } from "@/lib/motion/variants";

type FloatingProps = {
  children: ReactNode;
  /** Total travel of the bob in pixels. */
  distance?: number;
  /** Start offset in seconds (to desync multiple floating elements). */
  delay?: number;
  className?: string;
};

/**
 * Wraps decorative elements (brand motifs, accents) in a slow, gentle vertical
 * bob. Renders completely static when the user prefers reduced motion.
 */
export function Floating({ children, distance = 8, delay = 0, className }: FloatingProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{ y: [-distance / 2, distance / 2] }}
      transition={{ ...floatingTransition, delay }}
    >
      {children}
    </motion.div>
  );
}
