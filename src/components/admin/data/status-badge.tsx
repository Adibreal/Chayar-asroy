import { Badge } from "@/components/ui/badge";
import type { ContentStatus } from "@/types/database";

/**
 * Content lifecycle badge. One mapping, used by every list and editor, so
 * "published" always looks the same across the CMS.
 *
 * Colour is never the only signal — the word itself carries the meaning, which
 * keeps it readable for colour-blind users.
 */
const statusMeta: Record<
  ContentStatus,
  { label: string; variant: "success" | "default" | "outline" }
> = {
  published: { label: "Published", variant: "success" },
  draft: { label: "Draft", variant: "default" },
  archived: { label: "Archived", variant: "outline" },
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  const meta = statusMeta[status];
  return (
    <Badge variant={meta.variant} size="sm">
      {meta.label}
    </Badge>
  );
}
