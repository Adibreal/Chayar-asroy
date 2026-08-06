import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";

import { GalleryGrid } from "@/components/gallery";
import { Container, Section, Stack } from "@/components/layout";
import { Reveal } from "@/components/motion";
import { Decor } from "@/components/brand";
import { DecorativeBackground, DecorativeLayer } from "@/components/sections";
import { Heading, Text } from "@/components/typography";
import { Button, EmptyState, Separator } from "@/components/ui";
import { formatEventDate } from "@/lib/utils";
import { generateSiteMetadata } from "@/lib/seo/metadata";
import { getGalleryEvents } from "@/server/content/gallery";

/** How many photographs preview an event before "View event gallery". */
const PREVIEW_COUNT = 6;

export function generateMetadata() {
  return generateSiteMetadata({
    title: "Gallery",
    description:
      "Photographs from Chayar Asroy's workshops, community events and celebrations, event by event.",
    alternates: { canonical: "/gallery" },
  });
}

/**
 * The gallery, told as a sequence of events.
 *
 * Each event is a chapter: its title, when and where it happened, a handful of
 * photographs, and a way through to the rest. Newest first, so the page opens
 * on the most recent chapter.
 *
 * The grouping is `gallery_items.program_id` read back — the relationship the
 * images already carry. Nothing here duplicates it, and every image still lives
 * in exactly one place in the CMS.
 */
export default async function GalleryPage() {
  const events = await getGalleryEvents();
  const total = events.reduce((sum, event) => sum + event.images.length, 0);

  return (
    <>
      {/* Matches the /programs hero: compact, with the sections below carrying
          the spacing so the heading leads straight into the photographs. */}
      <Section spacing="md" className="relative isolate overflow-hidden pb-0">
        <DecorativeBackground variant="scatter" />
        {/*
          One mark beyond the shared preset, so this page and `/programs` — which
          otherwise inherit exactly the same arrangement — are recognisably
          different rooms in the same house. A spray high on the right answers
          the preset's low-left one.
        */}
        <DecorativeLayer>
          <Decor
            art="leafSpray"
            sizes="14vw"
            className="absolute top-2 right-[16%] hidden w-28 rotate-[125deg] opacity-25 xl:block"
          />
        </DecorativeLayer>
        <Container>
          <Reveal>
            <Stack gap="md" align="start" className="max-w-2xl">
              <Heading level={1} size="h1">
                Gallery
              </Heading>
              <Text variant="lead" tone="muted">
                {total > 0
                  ? `${total} photographs from our workshops, celebrations and community events — the children, their artwork and the volunteers who show up for them.`
                  : "Photographs from our workshops, celebrations and community events."}
              </Text>
            </Stack>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          {events.length === 0 ? (
            <EmptyState
              title="No photographs published yet"
              description="Images appear here as soon as they are published in the CMS with verified consent."
            />
          ) : (
            <Stack gap="xl">
              {events.map((event, index) => {
                const date = formatEventDate(event.eventDate);
                const facts = [
                  date
                    ? { icon: <CalendarDays className="size-4" aria-hidden />, value: date }
                    : null,
                  event.location
                    ? { icon: <MapPin className="size-4" aria-hidden />, value: event.location }
                    : null,
                ].filter((fact) => fact !== null);

                return (
                  <div key={event.slug ?? "ungrouped"}>
                    {/* A hairline between chapters, not `SectionDivider` —
                        that is a filled wave for masking a change of
                        background colour, and both sides here are cream. */}
                    {index > 0 ? <Separator className="mb-12" /> : null}
                    <Reveal>
                      <Stack gap="lg">
                        <Stack gap="sm" align="start">
                          <Heading level={2} size="h3">
                            {event.title}
                          </Heading>
                          {facts.length > 0 ? (
                            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-muted-foreground">
                              {facts.map((fact) => (
                                <li
                                  key={fact.value}
                                  className="inline-flex items-center gap-2 text-small"
                                >
                                  {fact.icon}
                                  {fact.value}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </Stack>

                        <GalleryGrid items={event.images.slice(0, PREVIEW_COUNT)} />

                        {/* Only an event with its own page gets a way through;
                            the ungrouped bucket has nowhere to go. */}
                        {event.slug ? (
                          <div className="flex justify-center">
                            <Button asChild variant="outline">
                              <Link href={`/gallery/${event.slug}`}>
                                View event gallery
                                <span className="sr-only"> for {event.title}</span>
                                <ArrowRight className="size-4" aria-hidden />
                              </Link>
                            </Button>
                          </div>
                        ) : null}
                      </Stack>
                    </Reveal>
                  </div>
                );
              })}
            </Stack>
          )}
        </Container>
      </Section>
    </>
  );
}
