import { Logo } from "../brand/logo";
import { Text } from "../typography/text";
import { Separator } from "../ui/separator";
import type { SiteContent } from "@/server/content/site";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

import { NavLinks } from "./nav-links";
import { SocialLinks, toSocialLinks } from "./social-links";

/**
 * Site footer: brand summary, navigation, socials, and legal line.
 *
 * Every value comes from Site settings in the CMS; each block is omitted when
 * its content is absent, so the layout stays balanced whatever is filled in.
 */
export function Footer({ site }: { site: SiteContent }) {
  const year = new Date().getFullYear();
  const hasNav = site.nav.some((item) => item.available);
  const hasContact = Boolean(site.location ?? site.contactEmail);
  const socials = toSocialLinks(site.socials);

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-12 sm:py-16">
        <div
          className={cn(
            "grid gap-10",
            hasNav && hasContact
              ? "md:grid-cols-[1.6fr_1fr_1fr]"
              : hasNav || hasContact
                ? "md:grid-cols-[1.6fr_1fr]"
                : "",
          )}
        >
          <div className="flex max-w-sm flex-col gap-4">
            <Logo name={site.name} nameBn={site.nameBn} />
            {site.description ? <Text tone="muted">{site.description}</Text> : null}
            {socials.length > 0 ? (
              <div className="mt-1 flex flex-col gap-2">
                <Text variant="label" tone="muted" className="text-muted-foreground">
                  Follow us
                </Text>
                <SocialLinks items={socials} />
              </div>
            ) : null}
          </div>

          {/* Omitted entirely while no routes are available, so the footer
              never shows an empty "Explore" column. */}
          {hasNav ? (
            <nav aria-label="Footer">
              <Text variant="label" tone="muted" className="mb-3 block px-3 text-muted-foreground">
                Explore
              </Text>
              <NavLinks items={site.nav} orientation="vertical" />
            </nav>
          ) : null}

          {hasContact ? (
            <div>
              <Text variant="label" tone="muted" className="mb-3 block text-muted-foreground">
                Get in touch
              </Text>
              <address className="flex flex-col gap-2 text-small text-muted-foreground not-italic">
                {site.location ? <span>{site.location}</span> : null}
                {site.contactEmail ? (
                  <a
                    href={`mailto:${site.contactEmail}`}
                    className={cn(
                      "w-fit rounded-md font-medium text-primary hover:underline",
                      focusRing,
                    )}
                  >
                    {site.contactEmail}
                  </a>
                ) : null}
              </address>
            </div>
          ) : null}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-2 text-small text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          {site.tagline ? (
            <p>
              {site.tagline}
              {site.location ? ` · ${site.location}` : null}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
