import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GalleryCollection } from "@/components/gallery";
import { Container, Section, Stack } from "@/components/layout";
import { Reveal } from "@/components/motion";
import { DecorativeBackground } from "@/components/sections";
import { Heading, Text } from "@/components/typography";
import { Button } from "@/components/ui";
import { formatEventDate } from "@/lib/utils";
import { generateSiteMetadata } from "@/lib/seo/metadata";
import { getGalleryEvent, getGalleryEventSlugs } from "@/server/content/gallery";
import { createRouteAvailability, getSiteContent } from "@/server/content/site";

/** Prerender every event that has photographs. */
export async function generateStaticParams() {
  const slugs = await getGalleryEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getGalleryEvent(slug);
  if (!event) return generateSiteMetadata();

  return generateSiteMetadata({
    title: `${event.title} — Gallery`,
    description:
      event.summary ??
      `Photographs from ${event.title}${event.location ? ` in ${event.location}` : ""}.`,
    alternates: { canonical: `/gallery/${slug}` },
  });
}

/**
 * One event's photographs.
 *
 * The story of the event lives on `/programs/[slug]`; this page is for looking
 * at the pictures, so it carries only what identifies the occasion and then
 * gets out of the way. `GalleryCollection` with no `previewCount` shows every
 * image and opens the same full-screen lightbox used everywhere else — arrows,
 * keyboard, swipe and neighbour preloading included.
 */
export default async function GalleryEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [event, site] = await Promise.all([getGalleryEvent(slug), getSiteContent()]);

  if (!event) notFound();

  const isAvailable = createRouteAvailability(site.nav);
  const date = formatEventDate(event.eventDate);
  const facts = [
    date ? { icon: <CalendarDays className="size-4" aria-hidden />, value: date } : null,
    event.location
      ? { icon: <MapPin className="size-4" aria-hidden />, value: event.location }
      : null,
  ].filter((fact) => fact !== null);

  return (
    <>
      <Section spacing="md" className="relative isolate overflow-hidden pb-0">
        <DecorativeBackground variant="scatter" />
        <Container>
          <Reveal>
            <Stack gap="md" align="start" className="max-w-2xl">
              <Button asChild variant="ghost" size="sm" className="-ml-3">
                <Link href="/gallery">
                  <ArrowLeft className="size-4" aria-hidden />
                  All events
                </Link>
              </Button>

              <Heading level={1} size="h1">
                {event.title}
              </Heading>

              {facts.length > 0 ? (
                <ul className="flex flex-wrap gap-x-5 gap-y-1 text-muted-foreground">
                  {facts.map((fact) => (
                    <li key={fact.value} className="inline-flex items-center gap-2 text-small">
                      {fact.icon}
                      {fact.value}
                    </li>
                  ))}
                </ul>
              ) : null}

              {event.summary ? (
                <Text variant="lead" tone="muted">
                  {event.summary}
                </Text>
              ) : null}

              {/* The full story lives on the programme page — linked rather
                  than repeated, so each event is written down exactly once. */}
              {event.slug && isAvailable("/programs") ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/programs/${event.slug}`}>Read the full story</Link>
                </Button>
              ) : null}
            </Stack>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <Reveal>
            <GalleryCollection items={event.images} label={`${event.title} gallery`} />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
