import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Media } from "../media/media";
import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import { Card } from "../ui/card";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { Story } from "@/types";

/** Preview card for a story/article: image, title, excerpt, read-more. */
export function StoryCard({
  story,
  href,
  className,
}: {
  story: Story;
  href?: string;
  className?: string;
}) {
  const link = href ?? `/stories/${story.slug}`;

  return (
    <Card
      variant="interactive"
      className={cn("group relative flex flex-col overflow-hidden", className)}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Media
          image={story.heroImage}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="transition-transform duration-[var(--duration-slow)] ease-[var(--ease-brand)] group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <Heading level={3} size="h5">
          <Link
            href={link}
            className={cn(
              "rounded-sm transition-colors after:absolute after:inset-0 hover:text-primary",
              focusRing,
            )}
          >
            {story.title}
          </Link>
        </Heading>
        <Text tone="muted" className="flex-1">
          {story.excerpt}
        </Text>
        <span className="mt-2 inline-flex items-center gap-1 text-small font-medium text-primary">
          Read story
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Card>
  );
}
