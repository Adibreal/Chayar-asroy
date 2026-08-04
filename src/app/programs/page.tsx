import { Container, Section, Stack } from "@/components/layout";
import { Reveal } from "@/components/motion";
import { ProjectGrid } from "@/components/projects";
import { DecorativeBackground } from "@/components/sections";
import { Heading, Text } from "@/components/typography";
import { EmptyState } from "@/components/ui";
import { generateSiteMetadata } from "@/lib/seo/metadata";
import { getPrograms } from "@/server/content/programs";

export function generateMetadata() {
  return generateSiteMetadata({
    title: "Programs",
    description:
      "Every programme Chayar Asroy has run — workshops, learning support and community events for children across Bangladesh.",
    alternates: { canonical: "/programs" },
  });
}

/**
 * The complete programme archive.
 *
 * The homepage shows a curated three; this page deliberately shows **every**
 * published programme with nothing hidden behind an interaction, so the archive
 * is complete both for a reader and for a crawler. Same `ProjectGrid` as the
 * homepage, so a programme looks identical wherever it appears.
 *
 * Statically rendered like the rest of the public site — the CMS's
 * `revalidatePath("/programs")` refreshes it on save.
 */
export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <>
      {/*
       * Page hero. Compact by design: `spacing` is `md` top and the grid
       * section carries no top padding, so the heading leads straight into the
       * cards instead of opening with a band of empty page.
       */}
      <Section spacing="md" className="relative isolate overflow-hidden pb-0">
        <DecorativeBackground variant="scatter" />
        <Container>
          <Reveal>
            <Stack gap="md" align="start" className="max-w-2xl">
              <Heading level={1} size="h1">
                Programs
              </Heading>
              <Text variant="lead" tone="muted">
                Discover the workshops, community initiatives and creative events through which
                Chayar Asroy continues to make an impact.
              </Text>
            </Stack>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          {programs.length > 0 ? (
            <ProjectGrid projects={programs} detailsAvailable headingLevel={2} />
          ) : (
            <EmptyState
              title="No programmes published yet"
              description="Programmes appear here as soon as they are published in the CMS."
            />
          )}
        </Container>
      </Section>
    </>
  );
}
