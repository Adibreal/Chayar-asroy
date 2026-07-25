"use client";

import { motion } from "motion/react";
import { Children, type ReactNode } from "react";

import { staggerContainer, staggerItem } from "@/lib/motion/variants";

type StaggerProps = {
  children: ReactNode;
  /** Container classes — pass grid/flex utilities here; each child becomes an item. */
  className?: string;
  itemClassName?: string;
  once?: boolean;
  amount?: number;
};

/**
 * Reveals its direct children one-by-one as the group scrolls into view. The
 * container carries your layout classes (e.g. a grid); each child is wrapped in
 * a motion item, so it works as a grid/flex parent. Reduced motion is honoured
 * globally.
 */
export function Stagger({
  children,
  className,
  itemClassName,
  once = true,
  amount = 0.2,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {Children.map(children, (child) => (
        <motion.div variants={staggerItem} className={itemClassName}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
