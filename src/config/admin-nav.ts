import type { UserRole } from "@/types/database";

/**
 * The CMS menu — configuration, not markup.
 *
 * Adding a section is a one-entry change here; nothing in the sidebar,
 * breadcrumbs or mobile drawer needs touching. `minRole` hides entries a user
 * cannot use (UX only — RLS remains the authority).
 *
 * `enabled: false` marks sections whose editors arrive in Phase 5C, so the menu
 * never links to a page that doesn't exist yet.
 */
export type AdminNavItem = {
  label: string;
  href: string;
  /** lucide-react icon name, resolved by the sidebar's icon registry. */
  icon: AdminIconName;
  minRole?: UserRole;
  enabled?: boolean;
  children?: AdminNavItem[];
};

export type AdminNavSection = {
  /** Optional heading above a group of links. */
  title?: string;
  items: AdminNavItem[];
};

/** Icons the CMS may use. Keeping this closed keeps the bundle small. */
export const ADMIN_ICON_NAMES = [
  "dashboard",
  "pages",
  "programs",
  "gallery",
  "stories",
  "media",
  "settings",
  "users",
  "navigation",
] as const;

export type AdminIconName = (typeof ADMIN_ICON_NAMES)[number];

export const adminNav: AdminNavSection[] = [
  {
    items: [{ label: "Dashboard", href: "/admin", icon: "dashboard" }],
  },
  {
    title: "Content",
    items: [
      { label: "Homepage", href: "/admin/pages", icon: "pages" },
      { label: "Programs", href: "/admin/programs", icon: "programs" },
      { label: "Gallery", href: "/admin/gallery", icon: "gallery" },
      { label: "Stories", href: "/admin/stories", icon: "stories" },
    ],
  },
  {
    title: "Library",
    items: [{ label: "Media", href: "/admin/media", icon: "media" }],
  },
  {
    title: "Configuration",
    items: [
      {
        label: "Site settings",
        href: "/admin/settings",
        icon: "settings",
        minRole: "admin",
      },
      {
        label: "Navigation",
        href: "/admin/navigation",
        icon: "navigation",
        minRole: "admin",
        enabled: false,
      },
      {
        label: "People",
        href: "/admin/users",
        icon: "users",
        minRole: "super_admin",
        enabled: false,
      },
    ],
  },
];

/** Flat list of every nav item, used by breadcrumbs to resolve a path. */
export const adminNavIndex: AdminNavItem[] = adminNav.flatMap((section) =>
  section.items.flatMap((item) => [item, ...(item.children ?? [])]),
);
