import type { ReactNode } from "react";

import { Spiral } from "../brand/motifs";
import { Container } from "../layout/container";
import { cn } from "@/lib/utils";

type QuoteSectionProps = {
  quote: ReactNode;
  author?: ReactNode;
  meta?: ReactNode;
  className?: string;
};

/** A large, centered brand quote — a quiet, editorial moment between sections. */
export function QuoteSection({ quote, author, meta, className }: QuoteSectionProps) {
  return (
    <Container size="md" className={cn("text-center", className)}>
      <Spiral className="mx-auto mb-6 size-10 text-secondary/60" />
      <p className="font-display text-h2 text-balance text-foreground italic">
        &ldquo;{quote}&rdquo;
      </p>
      {author || meta ? (
        <p className="mt-6 text-small text-muted-foreground">
          {author ? (
            <span className="font-semibold text-foreground not-italic">{author}</span>
          ) : null}
          {meta ? (
            <span>
              {author ? ", " : null}
              {meta}
            </span>
          ) : null}
        </p>
      ) : null}
    </Container>
  );
}
