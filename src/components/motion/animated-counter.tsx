"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  /** Seconds. */
  duration?: number;
  /** Seconds to wait after entering view before counting. */
  delay?: number;
  className?: string;
  /** Format the current number (defaults to locale integer). */
  format?: (n: number) => string;
  /**
   * Fires once the count settles — used to choreograph what follows (e.g. a
   * glow pulse). Also fires immediately under reduced motion.
   */
  onComplete?: () => void;
};

/**
 * Counts up to `value` the first time it scrolls into view. Under reduced
 * motion it renders the final value immediately (no animation).
 */
export function AnimatedCounter({
  value,
  duration = 1.6,
  delay = 0,
  className,
  format,
  onComplete,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    // Reduced motion → duration 0 (jumps to the value, no animation). The value
    // is applied asynchronously via `onUpdate`, never a synchronous setState.
    const controls = animate(0, value, {
      duration: prefersReducedMotion ? 0 : duration,
      delay: prefersReducedMotion ? 0 : delay,
      // Decelerating curve: fast off the mark, settling gently — reads as
      // momentum rather than a linear ticker.
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
      onComplete,
    });
    return () => controls.stop();
  }, [inView, value, duration, delay, prefersReducedMotion, onComplete]);

  const formatted = format ? format(display) : Math.round(display).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {formatted}
    </span>
  );
}
