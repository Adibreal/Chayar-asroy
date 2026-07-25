import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType } from "react";

import type { PolymorphicProps } from "@/lib/polymorphic";
import { cn } from "@/lib/utils";

/**
 * Flow spaces *adjacent* children using the owl selector (`* + *`), so only
 * the gaps between elements get margin — ideal for long-form / prose-like
 * content where children are heterogeneous (headings, paragraphs, media).
 */
const flow = cva("", {
  variants: {
    gap: {
      xs: "[&>*+*]:mt-2",
      sm: "[&>*+*]:mt-3",
      md: "[&>*+*]:mt-4",
      lg: "[&>*+*]:mt-6",
      xl: "[&>*+*]:mt-8",
    },
  },
  defaultVariants: { gap: "md" },
});

type FlowOwnProps = VariantProps<typeof flow>;

export function Flow<E extends ElementType = "div">({
  as,
  gap,
  className,
  ...rest
}: PolymorphicProps<E, FlowOwnProps>) {
  const Comp = (as ?? "div") as ElementType;
  return <Comp className={cn(flow({ gap }), className)} {...rest} />;
}
