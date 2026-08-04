import { CalendarDays, MapPin, Users } from "lucide-react";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { PrimaryCta } from "@/components/cta";
import { ProgramGallery } from "@/components/gallery";
import { Container, Section, Split, Stack } from "@/components/layout";
import { Media } from "@/components/media";
import { Reveal } from "@/components/motion";
import { DecorativeBackground } from "@/components/sections";
import { Heading, Prose, Text } from "@/components/typography";
import { Badge, Card } from "@/components/ui";
import { formatEventDate } from "@/lib/utils";
import { generateSiteMetadata } from "@/lib/seo/metadata";
import { getProgramBySlug, getProgramSlugs } from "@/server/content/programs";
import { getSiteContent } from "@/server/content/site";

type Params = { params: Promise<{ slug: string }> };

/** Prerender every published programme, keeping these pages static. */
export async function generateStaticParams() {
  const slugs = await getProgramSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return generateSiteMetadata({ title: "Programme not found" });

  return generateSiteMetadata({
    title: program.title,
    description: program.summary,
    alternates: { canonical: `/programs/${program.slug}` },
    openGraph: {
      title: program.title,
      description: program.summary,
      ...(program.coverImage ? { images: [{ url: program.coverImage.src }] } : {}),
    },
  });
}

const categoryLabels = {
  art: { label: "Art", variant: "accent" as const },
  education: { label: "Education", variant: "secondary" as const },
  community: { label: "Community", variant: "primary" as const },
};

/**
 * One programme, told as a story.
 *
 * Server-rendered throughout; the only client component is the gallery, which
 * needs state to page through images. Every block is omitted when the CMS has
 * nothing for it, so a sparsely-filled programme still reads well.
 */
export default async function ProgramPage({ params }: Params) {
  const { slug } = await params;
  // Both request-cached, so the shared CTA costs no extra round-trip.
  const [program, site] = await Promise.all([getProgramBySlug(slug), getSiteContent()]);
  if (!program) notFound();

  const category = categoryLabels[program.category];
  const facts: { icon: ReactNode; value: string }[] = [
    {
      icon: <CalendarDays className="size-4" aria-hidden />,
      value: formatEventDate(program.eventDate) ?? "",
    },
    { icon: <MapPin className="size-4" aria-hidden />, value: program.location ?? "" },
    { icon: <Users className="size-4" aria-hidden />, value: program.participation ?? "" },
  ].filter((fact) => fact.value);

  return (
    <>
      {/*
       * Hero — image beside the facts rather than above them.
       *
       * A full-width banner pushed everything that identifies the programme
       * below the fold. `Split ratio="2-3"` gives the image ~40% of the width
       * on `md`+ and collapses to a single stacked column below that, so a
       * reader sees what/where/when/who without scrolling on either. Spacing is
       * `md` rather than `lg` for the same reason.
       */}
      <Section spacing="md" className="relative isolate overflow-hidden">
        <DecorativeBackground variant="garden" />
        <Container>
          <Split ratio="2-3" gap="xl" align="center">
            <Reveal>
              <div className="overflow-hidden rounded-3xl">
                <Media
                  image={program.coverImage}
                  sizes="(min-width: 768px) 42vw, 100vw"
                  className="aspect-4/3 w-full object-cover"
                  priority
                />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <Stack gap="md" align="start">
                <Badge variant={category.variant}>{category.label}</Badge>
                <Heading level={1} size="h1">
                  {program.title}
                </Heading>

                {facts.length > 0 ? (
                  <ul className="flex flex-col gap-2 text-muted-foreground">
                    {facts.map((fact) => (
                      <li key={fact.value} className="inline-flex items-center gap-2.5 text-small">
                        {fact.icon}
                        {fact.value}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <Text variant="lead" tone="muted" className="max-w-prose">
                  {program.summary}
                </Text>

                <PrimaryCta cta={site.primaryCta} />
              </Stack>
            </Reveal>
          </Split>
        </Container>
      </Section>

      {/*
       * Event overview — the whole event as one continuous read.
       *
       * The CMS still stores the overview, activities and objectives
       * separately because they are easier to write and revise that way, but
       * the documentation they come from was written as a single narrative, so
       * that is how it is presented. The join happens in the content layer.
       */}
      {program.narrative ? (
        <Section spacing="lg">
          <Container>
            <Reveal>
              {/*
                `max-w-4xl` (896px), not `max-w-prose` (~656px here).

                The narrow measure left roughly 600px of empty page beside the
                story on a desktop, which read as an unfinished column rather
                than an article. Left-aligned and still bounded — the text never
                runs edge to edge — so it reads as a case study without becoming
                a full-width wall.
              */}
              <Stack gap="lg" className="max-w-4xl">
                <Heading level={2} size="h3">
                  Event overview
                </Heading>
                <Prose text={program.narrative} />
              </Stack>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* Volunteers — the people who made it happen. */}
      {program.volunteers.length > 0 ? (
        <Section surface="sunken" spacing="lg" className="relative isolate overflow-hidden">
          <DecorativeBackground variant="blobs" />
          <Container>
            <Stack gap="lg">
              <Reveal>
                <Heading level={2} size="h3">
                  Volunteers
                </Heading>
              </Reveal>
              <Reveal delay={0.1}>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {program.volunteers.map((volunteer) => (
                    <li key={volunteer}>
                      <Card variant="base" padding="md" className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary/15 text-small font-semibold text-secondary"
                        >
                          {volunteer.trim().charAt(0).toUpperCase()}
                        </span>
                        <Text weight="medium">{volunteer}</Text>
                      </Card>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </Stack>
          </Container>
        </Section>
      ) : null}

      {/* Gallery — preview grid opening into the full-screen browser. */}
      {program.gallery.length > 0 ? (
        <Section spacing="lg">
          <Container>
            <Stack gap="lg">
              <Reveal>
                <Heading level={2} size="h3">
                  Gallery
                </Heading>
              </Reveal>
              <Reveal>
                <ProgramGallery items={program.gallery} label={`${program.title} gallery`} />
              </Reveal>
            </Stack>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
