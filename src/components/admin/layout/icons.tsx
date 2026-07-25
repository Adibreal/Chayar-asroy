import {
  FolderOpen,
  Image as ImageIcon,
  LayoutDashboard,
  Library,
  ListTree,
  Newspaper,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";

import type { AdminIconName } from "@/config/admin-nav";

/**
 * Icon registry for the CMS menu.
 *
 * Nav config stores an icon *name*, not a component, so `admin-nav.ts` stays
 * plain serialisable data (and could later come from the database) while the
 * icon set remains a closed, tree-shakeable list.
 */
export const adminIcons: Record<AdminIconName, ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  pages: FolderOpen,
  programs: Sparkles,
  gallery: ImageIcon,
  stories: Newspaper,
  media: Library,
  settings: Settings,
  users: Users,
  navigation: ListTree,
};
