import { Decor } from "../brand/decor";
import { Container, Section, Stack } from "../layout";
import { Reveal } from "../motion";
import { DecorativeLayer } from "../sections/backgrounds";
import { Heading, Prose } from "../typography";

/**
 * The organisation, in its own words — a single centred passage rather than a
 * grid of value cards.
 *
 * It replaced a two-column "vision and mission" block, and the change is the
 * point: a reader meeting a nonprofit for the first time wants one honest
 * paragraph, not a taxonomy. Centring it and giving it air makes it read as a
 * statement; splitting it into cards made it read as a brochure.
 *
 * The decoration is composed rather than scattered. The figure sits low and
 * left at low opacity so the eye registers it as texture on the way down the
 * page, never as an illustration to look at; the leaves weight the opposite
 * side so the composition balances around the text instead of framing it
 * symmetrically. Everything sits in a `DecorativeLayer` — `aria-hidden`,
 * `pointer-events-none`, behind the content — and the denser pieces only appear
 * once there is room for them.
 */
export function WhoWeAre({ title, body }: { title: string; body: string }) {
  return (
    <Section spacing="lg" className="relative isolate overflow-hidden">
      <DecorativeLayer>
        {/*
          The figure, at its largest anywhere on the site — this is the section
          about the people, so it is the one place the character is allowed real
          presence. Bottom-left and faint, so the eye registers it on the way
          down rather than stopping on it. Hidden below `md`, where there is no
          room for it to be quiet.
        */}
        <Decor
          art="figure"
          sizes="(min-width: 1024px) 20vw, 32vw"
          className="absolute -bottom-4 left-[3%] hidden w-40 opacity-40 md:block lg:w-52"
        />

        {/* Leaves answer the figure from the opposite corner: a large spray
            high-right, and a small mirrored one low-right so the right side has
            weight top and bottom without repeating at the same scale. */}
        <Decor
          art="leafSpray"
          sizes="(min-width: 1024px) 18vw, 32vw"
          className="absolute top-4 right-[4%] hidden w-40 -rotate-6 opacity-50 md:block lg:w-52"
        />
        <Decor
          art="leafSpray"
          sizes="12vw"
          className="absolute right-[10%] bottom-8 hidden w-24 -scale-x-100 rotate-[150deg] opacity-25 lg:block"
        />

        {/* Two spirals at different sizes and rotations — the smallest marks in
            the composition, filling the corners the other two leave empty. */}
        <Decor
          art="spiral"
          sizes="8vw"
          className="absolute top-[20%] left-[9%] hidden w-14 opacity-45 sm:block"
        />
        <Decor
          art="spiral"
          sizes="6vw"
          className="absolute top-[8%] right-[24%] w-10 -scale-x-100 -rotate-[30deg] opacity-30"
        />
      </DecorativeLayer>

      <Container>
        <Reveal>
          {/*
            `max-w-2xl` rather than the wider prose measure used elsewhere: this
            is a short passage meant to be read as a whole, and a narrower
            column keeps the centring from turning into ragged lines.
          */}
          <Stack gap="lg" align="center" className="mx-auto max-w-2xl text-center">
            <Heading level={2} size="h1">
              {title}
            </Heading>
            <Prose text={body} variant="lead" className="text-pretty" />
          </Stack>
        </Reveal>
      </Container>
    </Section>
  );
}
