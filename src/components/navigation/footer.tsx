import { Logo } from "../brand/logo";
import { Text } from "../typography/text";
import { Separator } from "../ui/separator";
import { siteConfig } from "@/config/site";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

import { NavLinks } from "./nav-links";
import { SocialLinks } from "./social-links";

/** Site footer: brand summary, navigation, socials, and legal line. */
export function Footer() {
  const year = new Date().getFullYear();
  const hasNav = siteConfig.nav.some((item) => item.available !== false);

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-12 sm:py-16">
        <div
          className={cn(
            "grid gap-10",
            hasNav ? "md:grid-cols-[1.6fr_1fr_1fr]" : "md:grid-cols-[1.6fr_1fr]",
          )}
        >
          <div className="flex max-w-sm flex-col gap-4">
            <Logo />
            <Text tone="muted">{siteConfig.description}</Text>
            <div className="mt-1 flex flex-col gap-2">
              <Text variant="label" tone="muted" className="text-muted-foreground">
                Follow us
              </Text>
              <SocialLinks />
            </div>
          </div>

          {/* Omitted entirely while no routes are available, so the footer
              never shows an empty "Explore" column. */}
          {hasNav ? (
            <nav aria-label="Footer">
              <Text variant="label" tone="muted" className="mb-3 block px-3 text-muted-foreground">
                Explore
              </Text>
              <NavLinks orientation="vertical" />
            </nav>
          ) : null}

          <div>
            <Text variant="label" tone="muted" className="mb-3 block text-muted-foreground">
              Get in touch
            </Text>
            <address className="flex flex-col gap-2 text-small text-muted-foreground not-italic">
              <span>{siteConfig.location}</span>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className={cn(
                  "w-fit rounded-md font-medium text-primary hover:underline",
                  focusRing,
                )}
              >
                {siteConfig.contactEmail}
              </a>
            </address>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-2 text-small text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Student-led creativity &amp; care · {siteConfig.location}</p>
        </div>
      </div>
    </footer>
  );
}
