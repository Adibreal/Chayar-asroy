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
 *
 * Rendered on cobalt so the page has a definite ending. `NavLinks` and
 * `SocialLinks` are shared with the header, where they sit on cream — rather
 * than fork them, their link colours are overridden from here, which keeps one
 * implementation of each and confines the inversion to this file.
 */
export function Footer({ site }: { site: SiteContent }) {
  const year = new Date().getFullYear();
  const hasNav = site.nav.some((item) => item.available);
  const hasContact = Boolean(site.location ?? site.contactEmail);
  const socials = toSocialLinks(site.socials);

  return (
    <footer className="text-primary-foreground">
      {/*
        The cobalt block starts on a hard edge — no fade, gradient or overlay
        between the cream page and the footer.

        The top padding here is deliberate and load-bearing: it is the footer's
        only source of space above the logo, so the content does not sit flush
        against that edge.
      */}
      <div className="bg-primary">
        <div className="container-page pt-16 pb-12 sm:pt-24 sm:pb-16">
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
              {site.description ? (
                <Text className="text-primary-foreground/80">{site.description}</Text>
              ) : null}
              {socials.length > 0 ? (
                <div className="mt-1 flex flex-col gap-2">
                  <Text variant="label" className="text-primary-foreground">
                    Follow us
                  </Text>
                  <SocialLinks
                    items={socials}
                    className="[&_a]:text-primary-foreground [&_a:hover]:bg-primary-foreground/15 [&_a:hover]:text-primary-foreground"
                  />
                </div>
              ) : null}
            </div>

            {/* Omitted entirely while no routes are available, so the footer
                never shows an empty "Explore" column. */}
            {hasNav ? (
              <nav aria-label="Footer">
                <Text variant="label" className="mb-3 block px-3 text-primary-foreground">
                  Explore
                </Text>
                <NavLinks
                  items={site.nav}
                  orientation="vertical"
                  className="[&_a]:text-primary-foreground/85 [&_a:hover]:text-primary-foreground [&_a[aria-current]]:underline"
                />
              </nav>
            ) : null}

            {hasContact ? (
              <div>
                <Text variant="label" className="mb-3 block text-primary-foreground">
                  Get in touch
                </Text>
                <address className="flex flex-col gap-2 text-small text-primary-foreground/80 not-italic">
                  {site.location ? <span>{site.location}</span> : null}
                  {site.contactEmail ? (
                    <a
                      href={`mailto:${site.contactEmail}`}
                      className={cn(
                        "w-fit rounded-md font-medium text-primary-foreground hover:underline",
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

          <Separator className="my-8 bg-primary-foreground/20" />

          <div className="flex flex-col gap-2 text-small text-primary-foreground/75 sm:flex-row sm:items-center sm:justify-between">
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
      </div>
    </footer>
  );
}
