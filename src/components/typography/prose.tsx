import { cn } from "@/lib/utils";

import { Emphasis } from "./emphasis";
import { Text } from "./text";

/**
 * Long-form CMS text rendered as flowing paragraphs.
 *
 * Blank lines separate paragraphs; `*asterisks*` mark the brand's accented
 * italic, the same convention the impact headline uses. That is the whole
 * vocabulary — deliberately.
 *
 * The programme pages are meant to read as a story rather than a blog post, and
 * this project pins its dependencies on purpose, so a full Markdown parser was
 * not added for two prose fields. If richer formatting (headings, lists, links)
 * is wanted later, this is the single component to swap — see the note in
 * HANDOFF.md §9.
 */
export function Prose({ text, className }: { text: string; className?: string }) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return null;

  return (
    // `gap-5` rather than `gap-4`: these passages are read continuously, and
    // the extra air is what makes a long narrative feel like a story rather
    // than a stack of blocks.
    <div className={cn("flex flex-col gap-5", className)}>
      {paragraphs.map((paragraph, index) => (
        <Text key={index} tone="muted">
          {/* Single newlines inside a paragraph stay soft breaks, so an editor's
              line wrapping never invents a new paragraph. */}
          {paragraph.split("\n").map((line, lineIndex) => (
            <span key={lineIndex}>
              {lineIndex > 0 ? " " : null}
              <Emphasis text={line.trim()} />
            </span>
          ))}
        </Text>
      ))}
    </div>
  );
}
