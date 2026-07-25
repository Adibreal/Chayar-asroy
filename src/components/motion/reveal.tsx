"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { reveal as revealVariant } from "@/lib/motion/variants";

type RevealProps = {
  children: ReactNode;
  /** Which entrance variant to use (defaults to the calm upward reveal). */
  variants?: Variants;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Animate only the first time it enters the viewport. */
  once?: boolean;
  /** Fraction of the element that must be visible to trigger (0–1). */
  amount?: number;
  className?: string;
};

/**
 * Reveals its children as they scroll into view. Motion honours
 * `prefers-reduced-motion` globally (via MotionProvider), so this degrades to a
 * simple opacity change — never a jarring slide — for those users.
 */
export function Reveal({
  children,
  variants = revealVariant,
  delay = 0,
  once = true,
  amount = 0.2,
  className,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
