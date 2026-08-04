import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Media } from "../media/media";
import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { focusRing } from "@/lib/styles";
import { cn, formatEventDate } from "@/lib/utils";
import type { Program } from "@/types";

/** Category → badge label + color (maps to the poster's ART / EDUCATION / COMMUNITY tags). */
const categoryMeta = {
  art: { label: "Art", variant: "accent" as const },
  education: { label: "Education", variant: "secondary" as const },
  community: { label: "Community", variant: "primary" as const },
};

type ProjectCardProps = {
  project: Program;
  href?: string;
  /**
   * Whether `/programs` is built yet, from the CMS navigation. Passed in rather
   * than looked up so a grid of cards never queries navigation once per card.
   */
  detailsAvailable?: boolean;
  /**
   * Heading level for the card title, so the document outline stays correct
   * wherever the grid is used: `3` under the homepage's section heading, `2`
   * directly under the page title on `/programs`.
   */
  headingLevel?: 2 | 3;
  className?: string;
};

/**
 * Program/project card: cover image, category badge, title, summary. The whole
 * card is clickable via a stretched link while keeping the title semantic and
 * keyboard-focusable.
 */
export function ProjectCard({
  project,
  href,
  detailsAvailable = false,
  headingLevel = 3,
  className,
}: ProjectCardProps) {
  const category = categoryMeta[project.category];
  const meta = {
    ...category,
    facts: [formatEventDate(project.eventDate), project.location, project.participation].filter(
      (fact): fact is string => Boolean(fact),
    ),
  };
  // Detail pages don't exist until /programs ships, so the card presents as
  // static content rather than a link that would 404. Re-links automatically
  // once that navigation item is marked available in the CMS.
  const link = href ?? (detailsAvailable ? `/programs/${project.slug}` : null);

  return (
    <Card
      variant={link ? "interactive" : "base"}
      /* `h-full` lets the card fill its grid row so every card in a row ends at
         the same height, whatever the length of its title or summary. The image
         keeps a fixed aspect ratio, so those line up too. */
      className={cn("group relative flex h-full flex-col overflow-hidden", className)}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Media
          image={project.coverImage}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="transition-transform duration-[var(--duration-slow)] ease-[var(--ease-brand)] group-hover:scale-105"
        />
        <Badge variant={meta.variant} className="absolute top-4 left-4">
          {meta.label}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6">
        {/* Two lines maximum, so a long title cannot push the facts or the
            summary out of alignment with the neighbouring cards. */}
        <Heading level={headingLevel} size="h4" className="line-clamp-2">
          {link ? (
            <Link
              href={link}
              className={cn(
                "rounded-sm transition-colors after:absolute after:inset-0 hover:text-primary",
                focusRing,
              )}
            >
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </Heading>
        {/* Event facts, shown only when the CMS has them — the homepage cards
            usually carry none, so the layout is unchanged there. */}
        {meta.facts.length > 0 ? (
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted-foreground">
            {meta.facts.map((fact) => (
              <li key={fact} className="inline-flex items-center gap-1.5">
                <span aria-hidden className="size-1 rounded-full bg-border first:hidden" />
                {fact}
              </li>
            ))}
          </ul>
        ) : null}

        {/*
          Clamped to four lines at its natural height — deliberately NOT
          `flex-1`.

          `line-clamp` renders a `-webkit-box` with hidden overflow, so letting
          it flex-grow made the box a different height from the text it holds:
          on the tallest card that cropped the fourth line part-way through.
          Sizing it to exactly four lines and letting `mt-auto` below do the
          pushing keeps the ellipsis clean and every card's link aligned.
        */}
        <Text tone="muted" className="line-clamp-4">
          {project.summary}
        </Text>
        {link ? (
          <span className="mt-auto inline-flex items-center gap-1 pt-4 text-small font-medium text-primary">
            Learn more
            <ArrowUpRight
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </span>
        ) : null}
      </div>
    </Card>
  );
}
