import { ArrowRight, BookOpen, Check, Gift, Palette } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Sprout, Sun } from "@/components/brand";
import { CampaignCTA, PrimaryCta } from "@/components/cta";
import { GalleryGrid } from "@/components/gallery";
import { ImpactColumns } from "@/components/impact";
import { Hero, HeroActions, HeroBadge, HeroContent, HeroMedia } from "@/components/hero";
import { Container, Section, Split, Stack } from "@/components/layout";
import { Reveal, Stagger } from "@/components/motion";
import { FeaturedProjects } from "@/components/projects";
import { DecorativeBackground, SectionHeader } from "@/components/sections";
import { QuoteSection, TestimonialCard } from "@/components/testimonials";
import { Emphasis, Heading, Text } from "@/components/typography";
import { Button, Card, IconBadge } from "@/components/ui";
import { generateSiteMetadata } from "@/lib/seo/metadata";
import { getHomeContent } from "@/server/content/home";
import { createRouteAvailability, getSiteContent } from "@/server/content/site";
import { DONATION_ITEMS } from "@/types";

export function generateMetadata() {
  return generateSiteMetadata({ alternates: { canonical: "/" } });
}

/**
 * Regenerate hourly.
 *
 * The gallery preview is four images drawn at random from the whole gallery. On
 * a purely static page that random draw happens once at build time and then
 * never changes, so the "fresh over time" part comes from regeneration, not
 * from the shuffle. An hour keeps the page varied across a day's visitors while
 * still serving static HTML from the edge on every request — making the route
 * dynamic instead would cost a database round trip per visitor to achieve the
 * same thing. CMS saves still refresh it immediately via `revalidatePath("/")`.
 */
export const revalidate = 3600;

/**
 * Donation categories are a fixed taxonomy paired with an icon, exactly like
 * the platform→glyph registry behind `SocialLinks`. The surrounding copy is
 * CMS-driven; the three categories themselves are structural.
 */
const donationIcons: Record<string, ReactNode> = {
  "books-notebooks": <BookOpen />,
  "clothes-toys": <Gift />,
  "crayons-colours": <Palette />,
};

const pillarIcons = [
  { icon: <Sprout />, tone: "secondary" as const },
  { icon: <Sun />, tone: "accent" as const },
];

export default async function HomePage() {
  const [site, home] = await Promise.all([getSiteContent(), getHomeContent()]);
  const isAvailable = createRouteAvailability(site.nav);
  const { copy } = home;

  return (
    <>
      {/*
       * 1 · CURIOSITY — Hero
       * On large screens the hero fills exactly one viewport below the sticky
       * header and centres its content, so it always reads above the fold
       * without shrinking the typography. The `5rem` in the min-height is the
       * `lg` header height (Header's `h-20`) — keep the two in sync.
       */}
      {copy ? (
        <Section
          spacing="none"
          className="relative isolate overflow-hidden py-14 sm:py-16 lg:flex lg:min-h-[calc(100svh-5rem)] lg:items-center lg:py-12"
        >
          <DecorativeBackground variant="garden" />
          <Container>
            <Hero>
              <Reveal>
                <HeroContent>
                  {copy.hero.eyebrow ? <HeroBadge>{copy.hero.eyebrow}</HeroBadge> : null}
                  <Heading level={1} size="hero">
                    {copy.hero.title}
                  </Heading>
                  {copy.hero.description ? (
                    <Text variant="lead" tone="muted" className="max-w-prose">
                      {copy.hero.description}
                    </Text>
                  ) : null}
                  <HeroActions>
                    <PrimaryCta cta={site.primaryCta} size="lg" variant="accent" />
                    {copy.hero.secondaryCta && isAvailable(copy.hero.secondaryCta.href) ? (
                      <Button asChild size="lg" variant="outline">
                        <Link href={copy.hero.secondaryCta.href}>
                          {copy.hero.secondaryCta.label}
                          <ArrowRight className="size-4" aria-hidden />
                        </Link>
                      </Button>
                    ) : null}
                  </HeroActions>
                </HeroContent>
              </Reveal>
              <Reveal delay={0.15}>
                <HeroMedia image={home.heroImage ?? undefined} />
              </Reveal>
            </Hero>
          </Container>
        </Section>
      ) : null}

      {/* 2 · HOPE — Mission */}
      {copy && (copy.mission.title ?? copy.mission.pillars.length > 0) ? (
        <Section spacing="lg">
          <Container>
            <Split ratio="1-1" gap="xl" align="center">
              <Reveal>
                <SectionHeader
                  eyebrow={copy.mission.eyebrow ?? undefined}
                  title={copy.mission.title ?? undefined}
                  description={copy.mission.description ?? undefined}
                />
              </Reveal>
              <Reveal delay={0.1}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {copy.mission.pillars.map((pillar, i) => (
                    <Card key={pillar.title} variant="base" padding="lg">
                      <Stack gap="sm">
                        <IconBadge tone={pillarIcons[i]?.tone ?? "primary"}>
                          {pillarIcons[i]?.icon}
                        </IconBadge>
                        <Heading level={3} size="h5">
                          {pillar.title}
                        </Heading>
                        <Text tone="muted">{pillar.body}</Text>
                      </Stack>
                    </Card>
                  ))}
                </div>
              </Reveal>
            </Split>
          </Container>
        </Section>
      ) : null}

      {/* 3 · TRUST — Featured programs
          Stays a curated preview: only featured programmes, unchanged card
          count. The centred CTA below leads to the full index. */}
      {home.featuredPrograms.length > 0 ? (
        <Section surface="muted" spacing="lg">
          <Container>
            <Stack gap="xl">
              <FeaturedProjects
                eyebrow={copy?.programs.eyebrow ?? undefined}
                title={copy?.programs.title ?? undefined}
                description={copy?.programs.description ?? undefined}
                projects={home.featuredPrograms}
                detailsAvailable={isAvailable("/programs")}
              />
              {isAvailable("/programs") ? (
                <Reveal>
                  <div className="flex justify-center">
                    <Button asChild variant="outline" size="lg">
                      <Link href="/programs">
                        Explore all programs
                        <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </Button>
                  </div>
                </Reveal>
              ) : null}
            </Stack>
          </Container>
        </Section>
      ) : null}

      {/* 4 · CONNECTION — Gallery preview */}
      {home.galleryPreview.length > 0 ? (
        <Section spacing="lg">
          <Container>
            <Stack gap="lg">
              <Reveal>
                <SectionHeader
                  eyebrow={copy?.gallery.eyebrow ?? undefined}
                  title={copy?.gallery.title ?? undefined}
                />
              </Reveal>
              <Reveal>
                <GalleryGrid items={home.galleryPreview} />
              </Reveal>
              {/*
               * The link to the full gallery lives here rather than in the
               * section header: one call to action, centred under the images it
               * refers to, matching how the programmes section closes.
               */}
              {isAvailable("/gallery") ? (
                <Reveal>
                  <div className="flex justify-center">
                    <Button asChild variant="outline">
                      <Link href="/gallery">
                        Explore all photos
                        <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </Button>
                  </div>
                </Reveal>
              ) : null}
            </Stack>
          </Container>
        </Section>
      ) : null}

      {/* 5 · CONNECTION — Voices (the emotional centre; given extra air) */}
      {home.testimonials.length > 0 ? (
        <Section surface="sunken" spacing="xl" className="relative isolate overflow-hidden">
          <DecorativeBackground variant="blobs" />
          <Container>
            <Stack gap="xl">
              {copy?.voices ? (
                <Reveal>
                  <QuoteSection
                    quote={copy.voices.quote}
                    author={copy.voices.author ?? undefined}
                  />
                </Reveal>
              ) : null}
              <Stagger className="grid gap-6 sm:grid-cols-2">
                {home.testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.name + testimonial.quote}
                    quote={testimonial.quote}
                    name={testimonial.name}
                    meta={testimonial.meta}
                    avatarSrc={testimonial.avatar?.src}
                  />
                ))}
              </Stagger>
            </Stack>
          </Container>
        </Section>
      ) : null}

      {/*
       * 5.5 · CREDIBILITY — Impact
       * Placed between the testimonials and the ask on purpose: a visitor moved
       * by a child's words is exactly the person wondering "does this add up?".
       * Answering there turns feeling into confidence right before we invite
       * them to help. Renders nothing when there are no figures.
       */}
      {home.impactStats.length > 0 ? (
        <Section spacing="xl">
          <Container>
            <ImpactColumns
              eyebrow={copy?.impact.eyebrow ?? undefined}
              title={copy?.impact.title ? <Emphasis text={copy.impact.title} /> : undefined}
              description={copy?.impact.description ?? undefined}
              entries={home.impactStats}
              quote={copy?.impact.quote ?? undefined}
              quoteAttribution={copy?.impact.quoteAttribution ?? undefined}
            />
          </Container>
        </Section>
      ) : null}

      {/* 6 · PARTICIPATION — How to help (target of the primary CTA) */}
      {copy?.help.title ? (
        <Section id="how-to-help" spacing="lg" className="relative isolate overflow-hidden">
          <DecorativeBackground variant="scatter" />
          <Container>
            <Split ratio="1-1" gap="xl" align="center">
              <Reveal>
                <Stack gap="lg" align="start">
                  <SectionHeader
                    eyebrow={copy.help.eyebrow ?? undefined}
                    title={copy.help.title}
                    description={copy.help.description ?? undefined}
                  />
                  {copy.help.cta ? (
                    <Button asChild variant="accent">
                      {/* External (the org's Instagram inbox) — new tab, safely. */}
                      <a href={copy.help.cta.href} target="_blank" rel="noopener noreferrer">
                        {copy.help.cta.label}
                      </a>
                    </Button>
                  ) : null}
                </Stack>
              </Reveal>
              <Reveal delay={0.1}>
                <Stack gap="lg">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {DONATION_ITEMS.map((item) => (
                      <Card
                        key={item.value}
                        variant="base"
                        padding="md"
                        className="flex flex-col items-center gap-2 text-center"
                      >
                        <IconBadge tone="accent">{donationIcons[item.value]}</IconBadge>
                        <Text weight="medium">{item.label}</Text>
                      </Card>
                    ))}
                  </div>
                  {copy.help.methods.length > 0 ? (
                    <ul className="flex flex-col gap-2.5">
                      {copy.help.methods.map((method) => (
                        <li
                          key={method}
                          className="flex items-center gap-2.5 text-muted-foreground"
                        >
                          <Check className="size-4 shrink-0 text-secondary" aria-hidden />
                          {method}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Stack>
              </Reveal>
            </Split>
          </Container>
        </Section>
      ) : null}

      {/* 7 · ACTION — Campaign CTA (content + button from Site settings) */}
      {site.campaign ? (
        <Section spacing="lg">
          <Container>
            <Reveal>
              <CampaignCTA campaign={site.campaign} cta={site.primaryCta} />
            </Reveal>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
