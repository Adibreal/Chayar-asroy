"use client";

import {
  Camera,
  ClipboardList,
  Heart,
  Inbox,
  Mail,
  MapPin,
  Palette,
  PenLine,
  Search,
} from "lucide-react";
import { type ReactNode, useState } from "react";

import {
  Blob,
  Leaf,
  LeafCluster,
  Logo,
  OrganicFrame,
  Spiral,
  Sprout,
  Squiggle,
  Star,
  Sun,
  TreeDivider,
} from "@/components/brand";
import { InstagramIcon } from "@/components/brand/social-icons";
import { ContactInfo, SocialContact } from "@/components/contact";
import { CTABanner, CTASection } from "@/components/cta";
import { FeaturedImage, GalleryGrid } from "@/components/gallery";
import type { GalleryItemData } from "@/components/gallery";
import { Media } from "@/components/media";
import { Hero, HeroActions, HeroBadge, HeroContent, HeroMedia, HeroStats } from "@/components/hero";
import { AchievementHighlight, ImpactMetrics } from "@/components/impact";
import { AutoGrid, Cluster, Container, Grid, Stack } from "@/components/layout";
import { AnimatedCounter, Floating, Reveal, Stagger } from "@/components/motion";
import { SocialLinks } from "@/components/navigation";
import { FeaturedProjects, ProjectCategories } from "@/components/projects";
import { SectionDivider, SectionHeader, SectionIntro } from "@/components/sections";
import { QuoteSection, StoryCard, TestimonialCard } from "@/components/testimonials";
import { Heading, Text } from "@/components/typography";
import {
  Avatar,
  Badge,
  Blockquote,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Chip,
  Divider,
  EmptyState,
  Field,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Spinner,
  Switch,
  Textarea,
  Tooltip,
} from "@/components/ui";
import { OpportunityCard, VolunteerCTA, VolunteerHighlights } from "@/components/volunteer";
import { siteConfig } from "@/config/site";
import { type Program, type Story, VOLUNTEER_ROLES } from "@/types";

/* ---------------------------------------------------------------- demo data */

const programs: Program[] = [
  {
    slug: "creative-workshops",
    title: "Creative Workshops",
    category: "art",
    summary: "Helping children discover confidence through painting and imagination.",
    order: 1,
  },
  {
    slug: "learning-support",
    title: "Learning Support",
    category: "education",
    summary: "After-school classes and resources to strengthen foundational learning.",
    order: 2,
  },
  {
    slug: "community-art-events",
    title: "Community Art Events",
    category: "community",
    summary: "Events that bring communities together through creativity.",
    order: 3,
  },
];

const stories: Story[] = [
  {
    slug: "nusrat",
    title: "Now I believe in myself",
    excerpt: "Before joining the art class, I was shy. Now I love drawing and I believe in myself.",
    publishedAt: "2026-05-01",
  },
  {
    slug: "rafi",
    title: "A place that feels like home",
    excerpt: "Here, we learn, create, and grow together as one big family.",
    publishedAt: "2026-04-12",
  },
];

const galleryItems: GalleryItemData[] = [
  "Painting Day",
  "Spring Workshop",
  "Victory Celebration",
  "Children Smiling",
  "Community Event",
  "Murals",
  "Story Time",
  "Art Fair",
].map((caption, i) => ({ id: String(i), caption, consentVerified: true }));

const impactStats = [
  { value: 500, label: "Children reached", suffix: "+" },
  { value: 40, label: "Volunteers" },
  { value: 25, label: "Workshops" },
  { value: 12, label: "Communities" },
];

const roleIcons: Record<string, ReactNode> = {
  "graphic-designer": <Palette />,
  "content-writer": <PenLine />,
  "planning-logistics": <ClipboardList />,
  "media-documentation": <Camera />,
};

const categories = [
  { value: "all", label: "All" },
  { value: "art", label: "Art" },
  { value: "education", label: "Education" },
  { value: "community", label: "Community" },
];

const swatches = [
  "bg-background",
  "bg-surface",
  "bg-surface-sunken",
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-highlight",
  "bg-muted",
];

/* ------------------------------------------------------------- local helpers */

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-12">
      <Heading level={2} size="h3" className="mb-6">
        {title}
      </Heading>
      {children}
    </section>
  );
}

/* --------------------------------------------------------------- the content */

export function ShowcaseContent() {
  const [category, setCategory] = useState("all");
  const [subscribed, setSubscribed] = useState(true);
  const [notify, setNotify] = useState(false);
  const [plan, setPlan] = useState("weekly");

  const filteredPrograms =
    category === "all" ? programs : programs.filter((p) => p.category === category);

  return (
    <>
      <Container className="flex flex-col gap-16 py-16">
        {/* Intro */}
        <header className="flex flex-col gap-3">
          <Text variant="label" tone="primary">
            Internal · Development only
          </Text>
          <Heading level={1} size="hero">
            Design System Showcase
          </Heading>
          <Text variant="lead" tone="muted" className="max-w-2xl">
            Every token, primitive, and feature component from Phases 3A & 3B. This page is excluded
            from production.
          </Text>
        </header>

        {/* Colors */}
        <Block id="colors" title="Color tokens">
          <Grid cols={4} gap="md">
            {swatches.map((bg) => (
              <div key={bg} className="flex flex-col gap-2">
                <div className={`h-16 rounded-xl border border-border ${bg}`} />
                <code className="text-caption text-muted-foreground">{bg}</code>
              </div>
            ))}
          </Grid>
        </Block>

        {/* Typography */}
        <Block id="typography" title="Typography">
          <Stack gap="sm">
            <Heading size="display">Display</Heading>
            <Heading size="hero">Hero heading</Heading>
            <Heading level={1}>Heading 1</Heading>
            <Heading level={2}>Heading 2</Heading>
            <Heading level={3}>Heading 3</Heading>
            <Text variant="lead">Lead — a slightly larger introductory paragraph.</Text>
            <Text variant="body">Body — the default reading size for paragraphs and content.</Text>
            <Text variant="small" tone="muted">
              Small — secondary supporting text.
            </Text>
            <Text variant="caption" tone="muted">
              Caption — the smallest label text.
            </Text>
            <Text variant="label" tone="primary">
              Label / eyebrow
            </Text>
            <Text variant="quote">“A quote set in the display serif.”</Text>
            <p lang="bn" className="font-bengali text-h4">
              ছায়ার আশ্রয়
            </p>
          </Stack>
        </Block>

        {/* Buttons */}
        <Block id="buttons" title="Buttons">
          <Stack gap="lg">
            <Cluster gap="sm">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="text">Text</Button>
              <Button variant="destructive">Destructive</Button>
            </Cluster>
            <Cluster gap="sm" align="center">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Search">
                <Search className="size-5" />
              </Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </Cluster>
          </Stack>
        </Block>

        {/* Forms */}
        <Block id="forms" title="Form controls">
          <Grid cols={2} gap="lg">
            <Stack gap="md">
              <Field label="Full name" description="How we should address you">
                {(p) => <Input placeholder="Nusrat Rahman" {...p} />}
              </Field>
              <Field label="Email" error="Please enter a valid email address">
                {(p) => <Input type="email" placeholder="you@example.com" {...p} />}
              </Field>
              <Field label="Message">
                {(p) => <Textarea placeholder="Tell us how you'd like to help…" {...p} />}
              </Field>
              <Field label="Area of interest">
                {(p) => (
                  <Select>
                    <SelectTrigger id={p.id} aria-describedby={p["aria-describedby"]}>
                      <SelectValue placeholder="Choose a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {VOLUNTEER_ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>
            </Stack>

            <Stack gap="md">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sub"
                  checked={subscribed}
                  onCheckedChange={(v) => setSubscribed(v === true)}
                />
                <Label htmlFor="sub">Subscribe to updates</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="notify" checked={notify} onCheckedChange={setNotify} />
                <Label htmlFor="notify">Enable notifications</Label>
              </div>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-small font-medium">Donation frequency</legend>
                <RadioGroup value={plan} onValueChange={setPlan}>
                  {["weekly", "monthly", "one-time"].map((v) => (
                    <div key={v} className="flex items-center gap-2">
                      <RadioGroupItem value={v} id={`plan-${v}`} />
                      <Label htmlFor={`plan-${v}`} className="capitalize">
                        {v}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </fieldset>
            </Stack>
          </Grid>
        </Block>

        {/* Feedback + misc */}
        <Block id="elements" title="Badges, chips, avatars, feedback">
          <Stack gap="lg">
            <Cluster gap="sm">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Education</Badge>
              <Badge variant="accent">Art</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="outline">Outline</Badge>
            </Cluster>
            <Cluster gap="sm">
              <Chip>Filter</Chip>
              <Chip selected>Selected</Chip>
              <Chip onRemove={() => {}}>Removable</Chip>
            </Cluster>
            <Cluster gap="sm" align="center">
              <Avatar alt="Nusrat Rahman" size="sm" />
              <Avatar alt="Rafi Ahmed" size="md" />
              <Avatar alt="Community" size="lg" shape="rounded" />
              <Tooltip content="Helpful hint">
                <Button variant="outline" size="sm">
                  Hover me
                </Button>
              </Tooltip>
              <Spinner />
            </Cluster>
            <div className="grid gap-4 sm:grid-cols-3">
              <Skeleton variant="block" className="h-24" />
              <Skeleton variant="text" className="w-full self-center" />
              <Skeleton variant="circle" className="size-16" />
            </div>
            <Divider label="Section break" />
            <EmptyState
              icon={<Inbox />}
              title="Nothing here yet"
              description="When there's content, it'll appear in this space."
              action={<Button size="sm">Add something</Button>}
            />
          </Stack>
        </Block>

        {/* Cards */}
        <Block id="cards" title="Cards">
          <Grid cols={3} gap="lg">
            <Card variant="base" padding="lg">
              <CardTitle>Base card</CardTitle>
              <CardDescription className="mt-1">
                A bordered surface for grouping content.
              </CardDescription>
            </Card>
            <Card variant="elevated" padding="lg">
              <CardTitle>Elevated card</CardTitle>
              <CardDescription className="mt-1">Raised with a soft, warm shadow.</CardDescription>
            </Card>
            <Card variant="interactive">
              <CardHeader>
                <CardTitle>Interactive card</CardTitle>
                <CardDescription>Lifts on hover / focus-within.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" variant="ghost">
                  Action
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Block>

        {/* Brand */}
        <Block id="brand" title="Brand motifs & decoration">
          <Stack gap="lg">
            <Logo />
            <Cluster gap="lg" align="center" className="text-primary">
              <Spiral className="size-8" />
              <Star className="size-8 text-marigold" />
              <Sun className="size-8 text-marigold" />
              <Leaf className="size-8 text-secondary" />
              <Sprout className="size-8 text-secondary" />
              <Squiggle className="w-24 text-highlight" />
              <Blob className="size-12 text-primary/20" />
            </Cluster>
            <div className="relative h-20">
              <LeafCluster className="absolute left-0" />
              <Leaf className="absolute right-0 size-10 text-secondary" />
            </div>
            <TreeDivider />
            <OrganicFrame shape="pebble" className="aspect-square max-w-xs">
              <Media />
            </OrganicFrame>
          </Stack>
        </Block>

        {/* Motion */}
        <Block id="motion" title="Motion patterns">
          <Stack gap="lg">
            <Reveal>
              <Card padding="lg">
                <Text>This card reveals on scroll (Reveal).</Text>
              </Card>
            </Reveal>
            <Cluster gap="lg" align="center">
              <Floating>
                <Star className="size-10 text-marigold" />
              </Floating>
              <Text tone="muted">Floating motif →</Text>
              <span className="font-display text-h1 text-primary">
                <AnimatedCounter value={1200} />+
              </span>
            </Cluster>
            <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <Card key={n} padding="md" className="text-center">
                  <Text>Item {n}</Text>
                </Card>
              ))}
            </Stagger>
          </Stack>
        </Block>

        {/* Sections */}
        <Block id="sections" title="Section headers">
          <Stack gap="lg">
            <SectionHeader
              eyebrow="About us"
              title="We believe art changes lives"
              description="A student-led initiative supporting children through creativity."
              action={<Button variant="outline">View all</Button>}
            />
            <TreeDivider />
            <SectionIntro
              eyebrow="Our journey"
              title="Every child deserves a canvas"
              description="Turning small acts of care into lasting change."
            />
          </Stack>
        </Block>
      </Container>

      {/* Hero (full-bleed) */}
      <section className="border-t border-border bg-surface py-16">
        <Container>
          <Text variant="label" tone="primary" className="mb-6 block">
            Hero
          </Text>
          <Hero>
            <HeroContent>
              <HeroBadge>Student-led creativity &amp; care</HeroBadge>
              <Heading level={1} size="hero">
                Every child deserves a canvas.
              </Heading>
              <Text variant="lead" tone="muted">
                Supporting underprivileged children in Bangladesh through creativity, learning, and
                community.
              </Text>
              <HeroActions>
                <Button size="lg">Support the work</Button>
                <Button size="lg" variant="outline">
                  Explore our journey
                </Button>
              </HeroActions>
              <HeroStats
                stats={[
                  { value: "500+", label: "Children" },
                  { value: "40", label: "Volunteers" },
                  { value: "12", label: "Communities" },
                ]}
              />
            </HeroContent>
            <HeroMedia />
          </Hero>
        </Container>
      </section>

      {/* Projects */}
      <Container className="py-16">
        <ProjectCategories
          categories={categories}
          value={category}
          onChange={setCategory}
          className="mb-8"
        />
        <FeaturedProjects
          projects={filteredPrograms}
          description="A few of the programs bringing creativity to children."
          action={<Button variant="outline">View all projects</Button>}
        />
      </Container>

      <SectionDivider fill="fill-surface" />

      {/* Gallery + Impact */}
      <section className="bg-surface py-16">
        <Container className="flex flex-col gap-12">
          <SectionHeader eyebrow="Gallery" title="Moments that inspire us" />
          <FeaturedImage caption="A moment from a recent workshop" className="mx-auto max-w-3xl" />
          <GalleryGrid items={galleryItems} />
          <ImpactMetrics stats={impactStats} />
        </Container>
      </section>

      {/* Testimonials */}
      <Container className="flex flex-col gap-12 py-16">
        <QuoteSection
          quote="Something you no longer need could mean everything to a child."
          author="Chayar Asroy"
        />
        <Grid cols={2} gap="lg">
          <TestimonialCard
            quote="Now I love drawing and I believe in myself."
            name="Nusrat"
            meta="Age 11"
          />
          <TestimonialCard
            quote="Chayar Asroy feels like home. Here, we learn, create, and grow."
            name="Rafi"
            meta="Age 13"
          />
        </Grid>
        <Grid cols={2} gap="lg">
          {stories.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </Grid>
        <Blockquote author="A volunteer" meta="Dhaka">
          Small contributions create meaningful change in a child&apos;s life.
        </Blockquote>
      </Container>

      {/* Volunteer */}
      <section className="bg-surface py-16">
        <Container className="flex flex-col gap-12">
          <SectionHeader eyebrow="Get involved" title="Bring your skills to the table" />
          <AutoGrid min="15rem" gap="lg">
            {VOLUNTEER_ROLES.map((role) => (
              <OpportunityCard
                key={role.value}
                icon={roleIcons[role.value]}
                title={role.label}
                description="Help us reach more children with your time and talent."
              />
            ))}
          </AutoGrid>
          <VolunteerHighlights
            items={[
              {
                icon: <Heart />,
                title: "Meaningful impact",
                description: "See the difference your effort makes.",
              },
              {
                icon: <Palette />,
                title: "Creative community",
                description: "Work alongside passionate changemakers.",
              },
              {
                icon: <ClipboardList />,
                title: "Flexible roles",
                description: "Contribute in the way that suits you.",
              },
            ]}
          />
          <AchievementHighlight
            icon={<Heart />}
            title="A growing family"
            description="Every volunteer helps a child learn, create, and grow."
          />
        </Container>
      </section>

      {/* Contact */}
      <Container className="flex flex-col gap-12 py-16">
        <SectionHeader eyebrow="Contact" title="Reach out to us" />
        <ContactInfo
          items={[
            { icon: <MapPin />, label: "Location", value: siteConfig.location },
            {
              icon: <Mail />,
              label: "Email",
              value: "hello@chayarasroy.org",
              href: "mailto:hello@chayarasroy.org",
            },
            {
              icon: <InstagramIcon />,
              label: "Instagram",
              value: "@chayar.asroy",
              href: siteConfig.socials.find((s) => s.platform === "instagram")?.href ?? "#",
            },
          ]}
        />
        <SocialContact />
        <SocialLinks />
      </Container>

      {/* CTA */}
      <Container className="flex flex-col gap-8 py-16">
        <CTASection
          eyebrow="Join us"
          title="Be the reason a child believes in tomorrow."
          description="Join our community of changemakers and help create a brighter future."
          actions={
            <>
              <Button size="lg" variant="accent">
                Become a Volunteer
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-primary-foreground hover:bg-white/10"
              >
                Support the Work
              </Button>
            </>
          }
        />
        <VolunteerCTA action={<Button variant="accent">Apply now</Button>} />
        <CTABanner
          title="How to help"
          description="Donate books, clothes, toys, crayons and colours."
          action={<Button>Learn more</Button>}
        />
      </Container>
    </>
  );
}
