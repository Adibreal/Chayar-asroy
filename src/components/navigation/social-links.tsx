import type { ComponentType } from "react";

import { FacebookIcon, InstagramIcon } from "../brand/social-icons";
import { siteConfig } from "@/config/site";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

export type SocialLink = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

/** Registry mapping a config `platform` to its glyph. Add a platform here + in
 *  `siteConfig.socials`; no other component needs to change. */
const iconByPlatform: Record<string, ComponentType<{ className?: string }>> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
};

/**
 * Default set derived from `siteConfig.socials` (order preserved). Platforms
 * without a registered icon are skipped rather than rendered blank. Pass
 * `items` to override.
 */
export const defaultSocialLinks: SocialLink[] = siteConfig.socials.flatMap((social) => {
  const icon = iconByPlatform[social.platform];
  return icon ? [{ label: social.label, href: social.href, icon }] : [];
});

const sizes = { sm: "size-9", md: "size-10" } as const;

type SocialLinksProps = {
  items?: SocialLink[];
  size?: keyof typeof sizes;
  className?: string;
};

/**
 * Row of social icon links. Each link is labelled for assistive tech and opens
 * safely in a new tab.
 */
export function SocialLinks({
  items = defaultSocialLinks,
  size = "md",
  className,
}: SocialLinksProps) {
  return (
    <ul className={cn("flex items-center gap-1.5", className)}>
      {items.map(({ label, href, icon: Icon }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(
              "inline-grid place-items-center rounded-full text-foreground transition-colors hover:bg-surface-hover hover:text-primary",
              sizes[size],
              focusRing,
            )}
          >
            <Icon className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export { FacebookIcon, InstagramIcon };
