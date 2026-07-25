import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BlockquoteProps = {
  children: ReactNode;
  /** Attribution name (rendered emphasized). */
  author?: ReactNode;
  /** Secondary attribution, e.g. age or role. */
  meta?: ReactNode;
  className?: string;
};

/**
 * Editorial pull-quote for stories & testimonials — the brand's serif voice
 * with a decorative opening quotation mark. Semantic `figure`/`blockquote`/
 * `figcaption`.
 */
export function Blockquote({ children, author, meta, className }: BlockquoteProps) {
  return (
    <figure className={cn("relative", className)}>
      <span
        aria-hidden
        className="pointer-events-none absolute -top-4 -left-1 font-display text-6xl leading-none text-primary/25 select-none"
      >
        &ldquo;
      </span>
      <blockquote className="relative font-display text-h4 text-balance text-foreground italic">
        {children}
      </blockquote>
      {author || meta ? (
        <figcaption className="mt-4 text-small text-muted-foreground">
          {author ? (
            <span className="font-semibold text-foreground not-italic">{author}</span>
          ) : null}
          {meta ? (
            <span>
              {author ? ", " : null}
              {meta}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
