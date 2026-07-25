import type { ComponentPropsWithoutRef, ElementType } from "react";

/**
 * Props for a polymorphic component that can render as a different element via
 * the `as` prop while preserving that element's native prop types.
 *
 * @example
 * function Stack<E extends ElementType = "div">(props: PolymorphicProps<E, StackOwnProps>) { … }
 */
export type PolymorphicProps<E extends ElementType, OwnProps = object> = OwnProps &
  Omit<ComponentPropsWithoutRef<E>, keyof OwnProps | "as"> & {
    as?: E;
  };
