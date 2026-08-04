import type { ReactNode } from "react";

import { Stagger } from "../motion/stagger";
import { SectionHeader } from "../sections/section-header";
import { cn } from "@/lib/utils";
import type { Program } from "@/types";

import { ProjectCard } from "./project-card";

/** Responsive, scroll-staggered grid of project cards. */
export function ProjectGrid({
  projects,
  detailsAvailable = false,
  headingLevel,
  className,
}: {
  projects: Program[];
  /** Forwarded to every card so navigation is resolved once, not per card. */
  detailsAvailable?: boolean;
  /** Card title level — `2` when the grid sits directly under a page title. */
  headingLevel?: 2 | 3;
  className?: string;
}) {
  return (
    // `itemClassName="h-full"`: Stagger wraps each child in its own motion
    // element, so the wrapper — not the card — is the grid item. Without this
    // the card has no full-height box to fill and rows go ragged.
    <Stagger
      className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}
      itemClassName="h-full"
    >
      {projects.map((project) => (
        <ProjectCard
          key={project.slug}
          project={project}
          detailsAvailable={detailsAvailable}
          {...(headingLevel ? { headingLevel } : {})}
        />
      ))}
    </Stagger>
  );
}

type FeaturedProjectsProps = {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  projects: Program[];
  detailsAvailable?: boolean;
  action?: ReactNode;
  className?: string;
};

/**
 * A complete "featured projects" section: header + staggered project grid.
 *
 * `eyebrow` and `title` deliberately have **no defaults**. They used to fall
 * back to hardcoded copy, which meant clearing those fields in the CMS made
 * that copy reappear on the public site — the section is CMS-driven, so an
 * empty field must render as empty, not as something an editor never wrote.
 */
export function FeaturedProjects({
  eyebrow,
  title,
  description,
  projects,
  detailsAvailable = false,
  action,
  className,
}: FeaturedProjectsProps) {
  return (
    <div className={cn("flex flex-col gap-10", className)}>
      <SectionHeader eyebrow={eyebrow} title={title} description={description} action={action} />
      <ProjectGrid projects={projects} detailsAvailable={detailsAvailable} />
    </div>
  );
}
