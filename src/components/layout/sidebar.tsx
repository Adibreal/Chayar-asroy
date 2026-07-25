import type { ElementType, ReactNode } from "react";

import type { PolymorphicProps } from "@/lib/polymorphic";
import { cn } from "@/lib/utils";

import { type Gap, gapClasses } from "./shared";

type SidebarOwnProps = {
  /** Sidebar content. Main content is passed as `children`. */
  sidebar: ReactNode;
  side?: "left" | "right";
  /** Ideal sidebar width; it grows to this, then wraps. */
  sideWidth?: string;
  /** Content wraps below the sidebar once it can't keep this inline size. */
  contentMin?: string;
  gap?: Gap;
};

/**
 * Every-Layout "sidebar": a sidebar of intrinsic width beside a flexible main
 * area that wraps *underneath* when there isn't room — no media queries, no
 * magic breakpoint. Fully fluid across all screen sizes.
 */
export function Sidebar<E extends ElementType = "div">({
  as,
  sidebar,
  side = "left",
  sideWidth = "16rem",
  contentMin = "60%",
  gap = "lg",
  className,
  children,
  ...rest
}: PolymorphicProps<E, SidebarOwnProps>) {
  const Comp = (as ?? "div") as ElementType;

  const aside = (
    <div className="grow" style={{ flexBasis: sideWidth }}>
      {sidebar}
    </div>
  );
  const main = (
    <div className="grow-[999] basis-0" style={{ minInlineSize: contentMin }}>
      {children}
    </div>
  );

  return (
    <Comp className={cn("flex flex-wrap", gapClasses[gap], className)} {...rest}>
      {side === "left" ? (
        <>
          {aside}
          {main}
        </>
      ) : (
        <>
          {main}
          {aside}
        </>
      )}
    </Comp>
  );
}
