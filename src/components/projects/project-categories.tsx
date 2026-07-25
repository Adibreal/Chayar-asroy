"use client";

import { Chip } from "../ui/chip";
import { cn } from "@/lib/utils";

export type ProjectCategory = { value: string; label: string };

type ProjectCategoriesProps = {
  categories: ProjectCategory[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

/**
 * Filter bar of toggle chips for project categories. Controlled — the parent
 * owns the selected `value`. Exposed as a labelled group for assistive tech.
 */
export function ProjectCategories({
  categories,
  value,
  onChange,
  className,
}: ProjectCategoriesProps) {
  return (
    <div
      role="group"
      aria-label="Filter projects by category"
      className={cn("flex flex-wrap gap-2", className)}
    >
      {categories.map((category) => (
        <Chip
          key={category.value}
          selected={value === category.value}
          onClick={() => onChange(category.value)}
        >
          {category.label}
        </Chip>
      ))}
    </div>
  );
}
