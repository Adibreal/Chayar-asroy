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
  className,
}: {
  projects: Program[];
  /** Forwarded to every card so navigation is resolved once, not per card. */
  detailsAvailable?: boolean;
  className?: string;
}) {
  return (
    <Stagger className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} detailsAvailable={detailsAvailable} />
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

/** A complete "featured projects" section: header + staggered project grid. */
export function FeaturedProjects({
  eyebrow = "Featured Programs",
  title = "Turning ideas into impact",
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
