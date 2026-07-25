import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Media } from "../media/media";
import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { isRouteAvailable } from "@/config/site";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
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
  className?: string;
};

/**
 * Program/project card: cover image, category badge, title, summary. The whole
 * card is clickable via a stretched link while keeping the title semantic and
 * keyboard-focusable.
 */
export function ProjectCard({ project, href, className }: ProjectCardProps) {
  const meta = categoryMeta[project.category];
  // Detail pages don't exist until /programs ships, so the card presents as
  // static content rather than a link that would 404. Re-links automatically
  // once the route is marked available in siteConfig.
  const link = href ?? (isRouteAvailable("/programs") ? `/programs/${project.slug}` : null);

  return (
    <Card
      variant={link ? "interactive" : "base"}
      className={cn("group relative flex flex-col overflow-hidden", className)}
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
        <Heading level={3} size="h4">
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
        <Text tone="muted" className="flex-1">
          {project.summary}
        </Text>
        {link ? (
          <span className="mt-2 inline-flex items-center gap-1 text-small font-medium text-primary">
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
