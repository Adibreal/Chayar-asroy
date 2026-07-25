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
import { Heading, Text } from "@/components/typography";
import { Button, Card, IconBadge } from "@/components/ui";
import {
  featuredPrograms,
  galleryPreview,
  hero,
  howToHelp,
  impact,
  impactStats,
  mission,
  testimonials,
} from "@/content/home";
import { isRouteAvailable } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ alternates: { canonical: "/" } });

const donationIcons: Record<string, ReactNode> = {
  "books-notebooks": <BookOpen />,
  "clothes-toys": <Gift />,
  "crayons-colours": <Palette />,
};

const pillarIcons = [
  { icon: <Sprout />, tone: "secondary" as const },
  { icon: <Sun />, tone: "accent" as const },
];

export default function HomePage() {
  return (
    <>
      {/*
       * 1 · CURIOSITY — Hero
       * On large screens the hero fills exactly one viewport below the sticky
       * header and centres its content, so it always reads above the fold
       * without shrinking the typography. The `5rem` in the min-height is the
       * `lg` header height (Header's `h-20`) — keep the two in sync.
       */}
      <Section
        spacing="none"
        className="relative isolate overflow-hidden py-14 sm:py-16 lg:flex lg:min-h-[calc(100svh-5rem)] lg:items-center lg:py-12"
      >
        <DecorativeBackground variant="garden" />
        <Container>
          <Hero>
            <Reveal>
              <HeroContent>
                <HeroBadge>{hero.eyebrow}</HeroBadge>
                <Heading level={1} size="hero">
                  {hero.title}
                </Heading>
                <Text variant="lead" tone="muted" className="max-w-prose">
                  {hero.description}
                </Text>
                <HeroActions>
                  <PrimaryCta size="lg" variant="accent" />
                  {isRouteAvailable(hero.secondaryCta.href) ? (
                    <Button asChild size="lg" variant="outline">
                      <Link href={hero.secondaryCta.href}>
                        {hero.secondaryCta.label}
                        <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </Button>
                  ) : null}
                </HeroActions>
              </HeroContent>
            </Reveal>
            <Reveal delay={0.15}>
              <HeroMedia image={hero.image} />
            </Reveal>
          </Hero>
        </Container>
      </Section>

      {/* 2 · HOPE — Mission */}
      <Section spacing="lg">
        <Container>
          <Split ratio="1-1" gap="xl" align="center">
            <Reveal>
              <SectionHeader
                eyebrow={mission.eyebrow}
                title={mission.title}
                description={mission.description}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid gap-4 sm:grid-cols-2">
                {mission.pillars.map((pillar, i) => (
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

      {/* 3 · TRUST — Featured programs */}
      {featuredPrograms.length > 0 ? (
        <Section surface="muted" spacing="lg">
          <Container>
            <FeaturedProjects
              eyebrow="Featured programs"
              title="Turning ideas into impact"
              description="A few of the programs bringing creativity to children across Bangladesh."
              projects={featuredPrograms}
              action={
                isRouteAvailable("/programs") ? (
                  <Button asChild variant="outline">
                    <Link href="/programs">
                      View all programs
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                ) : null
              }
            />
          </Container>
        </Section>
      ) : null}

      {/* 4 · CONNECTION — Gallery preview */}
      {galleryPreview.length > 0 ? (
        <Section spacing="lg">
          <Container>
            <Stack gap="lg">
              <Reveal>
                <SectionHeader
                  eyebrow="Gallery"
                  title="Moments that inspire us"
                  action={
                    isRouteAvailable("/gallery") ? (
                      <Button asChild variant="outline">
                        <Link href="/gallery">View full gallery</Link>
                      </Button>
                    ) : null
                  }
                />
              </Reveal>
              <Reveal>
                <GalleryGrid items={galleryPreview} />
              </Reveal>
            </Stack>
          </Container>
        </Section>
      ) : null}

      {/* 5 · CONNECTION — Voices (the emotional centre; given extra air) */}
      {testimonials.length > 0 ? (
        <Section surface="sunken" spacing="xl" className="relative isolate overflow-hidden">
          <DecorativeBackground variant="blobs" />
          <Container>
            <Stack gap="xl">
              <Reveal>
                <QuoteSection
                  quote="Creativity is not a luxury. It's a lifeline."
                  author="Chayar Asroy"
                />
              </Reveal>
              <Stagger className="grid gap-6 sm:grid-cols-2">
                {testimonials.map((testimonial) => (
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
      {impactStats.length > 0 ? (
        <Section spacing="xl">
          <Container>
            <ImpactColumns
              eyebrow={impact.eyebrow}
              title={
                <>
                  Small hands, <em className="text-primary">steady</em> work.
                </>
              }
              description={impact.description}
              entries={impactStats}
              quote={impact.quote}
              quoteAttribution={impact.quoteAttribution}
            />
          </Container>
        </Section>
      ) : null}

      {/* 6 · PARTICIPATION — How to help (target of the primary CTA) */}
      <Section id="how-to-help" spacing="lg" className="relative isolate overflow-hidden">
        <DecorativeBackground variant="scatter" />
        <Container>
          <Split ratio="1-1" gap="xl" align="center">
            <Reveal>
              <Stack gap="lg" align="start">
                <SectionHeader
                  eyebrow={howToHelp.eyebrow}
                  title={howToHelp.title}
                  description={howToHelp.description}
                />
                <Button asChild variant="accent">
                  {/* External (the org's Instagram inbox) — new tab, safely. */}
                  <a href={howToHelp.cta.href} target="_blank" rel="noopener noreferrer">
                    {howToHelp.cta.label}
                  </a>
                </Button>
              </Stack>
            </Reveal>
            <Reveal delay={0.1}>
              <Stack gap="lg">
                <div className="grid gap-3 sm:grid-cols-3">
                  {howToHelp.items.map((item) => (
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
                <ul className="flex flex-col gap-2.5">
                  {howToHelp.methods.map((method) => (
                    <li key={method} className="flex items-center gap-2.5 text-muted-foreground">
                      <Check className="size-4 shrink-0 text-secondary" aria-hidden />
                      {method}
                    </li>
                  ))}
                </ul>
              </Stack>
            </Reveal>
          </Split>
        </Container>
      </Section>

      {/* 7 · ACTION — Campaign CTA (content + button from siteConfig, reusable) */}
      <Section spacing="lg">
        <Container>
          <Reveal>
            <CampaignCTA />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
