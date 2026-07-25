import type { Transition, Variants } from "motion/react";

import { duration, easing } from "./tokens";

/**
 * Reusable Motion variants + presets — the shared motion language.
 *
 * Entrance variants pair with `initial="hidden"` and `animate="visible"` (or
 * `whileInView="visible"`). Interaction presets spread into `whileHover` /
 * `whileTap`. All animate transform/opacity only (GPU-friendly) and are
 * automatically neutralised by `MotionConfig reducedMotion="user"`.
 */

const enter = (d: number = duration.slow): Transition => ({
  duration: d,
  ease: easing.outSoft,
});

/* --- Entrance variants -------------------------------------------- */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: enter(duration.normal) },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: enter() },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: enter() },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: enter() },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: enter() },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: enter(duration.normal) },
};

/** A slightly larger upward reveal — the default for scroll-in sections. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: enter(duration.slower) },
};

/* --- Stagger orchestration ---------------------------------------- */

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = fadeInUp;

/* --- Interaction presets (spread into whileHover / whileTap) ------- */

export const hoverLift = {
  y: -3,
  transition: { duration: duration.fast, ease: easing.brand },
} as const;

export const hoverScale = {
  scale: 1.02,
  transition: { duration: duration.fast, ease: easing.brand },
} as const;

export const pressScale = { scale: 0.97 } as const;

/* --- Floating (gentle infinite bob for decorative motifs) ---------- */

export const floatingTransition: Transition = {
  duration: 4.5,
  ease: easing.inOutSoft,
  repeat: Infinity,
  repeatType: "mirror",
};
