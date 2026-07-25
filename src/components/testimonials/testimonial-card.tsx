import type { ReactNode } from "react";

import { Avatar } from "../ui/avatar";
import { Blockquote } from "../ui/blockquote";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

type TestimonialCardProps = {
  quote: ReactNode;
  name: string;
  /** Secondary line, e.g. age or role. */
  meta?: string;
  avatarSrc?: string;
  className?: string;
};

/** A testimonial: pull-quote plus attribution with an avatar. */
export function TestimonialCard({ quote, name, meta, avatarSrc, className }: TestimonialCardProps) {
  return (
    <Card
      variant="base"
      padding="lg"
      className={cn("flex h-full flex-col justify-between gap-6", className)}
    >
      <Blockquote>{quote}</Blockquote>
      <div className="flex items-center gap-3">
        <Avatar src={avatarSrc} alt={name} size="md" />
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{name}</span>
          {meta ? <span className="text-small text-muted-foreground">{meta}</span> : null}
        </div>
      </div>
    </Card>
  );
}
