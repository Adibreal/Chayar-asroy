"use client";

import Link from "next/link";

import { EditorForm, FormField, FormSection, ImageFormField } from "@/components/admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveHomePage } from "@/server/actions/page-actions";
import type { Page } from "@/types/database";
import { homepageSchema, type HomepageInput } from "@/validation/content";

type HomeContent = Partial<Record<string, string>>;

/**
 * Homepage editor.
 *
 * Covers the copy that is unique to the homepage. Two things deliberately live
 * elsewhere, so each has exactly one home:
 *  - the primary CTA and campaign band → Site settings
 *  - which programs/images are featured → the `Featured` flag on each item
 */
export function HomepageForm({ page, heroUrl }: { page: Page | null; heroUrl?: string | null }) {
  const content = (page?.content ?? {}) as HomeContent;

  const defaultValues = {
    heroEyebrow: content.heroEyebrow ?? "",
    heroTitle: content.heroTitle ?? "",
    heroDescription: content.heroDescription ?? "",
    // A column, not a `content` key — media relationships are real foreign keys.
    heroMediaId: page?.hero_media_id ?? undefined,
    heroSecondaryCtaLabel: content.heroSecondaryCtaLabel ?? "",
    heroSecondaryCtaHref: content.heroSecondaryCtaHref ?? "",
    missionEyebrow: content.missionEyebrow ?? "",
    missionTitle: content.missionTitle ?? "",
    missionDescription: content.missionDescription ?? "",
    missionPillarOneTitle: content.missionPillarOneTitle ?? "",
    missionPillarOneBody: content.missionPillarOneBody ?? "",
    missionPillarTwoTitle: content.missionPillarTwoTitle ?? "",
    missionPillarTwoBody: content.missionPillarTwoBody ?? "",
    programsEyebrow: content.programsEyebrow ?? "",
    programsTitle: content.programsTitle ?? "",
    programsDescription: content.programsDescription ?? "",
    galleryEyebrow: content.galleryEyebrow ?? "",
    galleryTitle: content.galleryTitle ?? "",
    voicesQuote: content.voicesQuote ?? "",
    voicesAuthor: content.voicesAuthor ?? "",
    impactEyebrow: content.impactEyebrow ?? "",
    impactTitle: content.impactTitle ?? "",
    impactDescription: content.impactDescription ?? "",
    impactQuote: content.impactQuote ?? "",
    impactQuoteAttribution: content.impactQuoteAttribution ?? "",
    helpEyebrow: content.helpEyebrow ?? "",
    helpTitle: content.helpTitle ?? "",
    helpDescription: content.helpDescription ?? "",
    helpMethods: content.helpMethods ?? "",
    helpCtaLabel: content.helpCtaLabel ?? "",
    helpCtaHref: content.helpCtaHref ?? "",
    metaTitle: page?.meta_title ?? "",
    metaDescription: page?.meta_description ?? "",
  } as never;

  return (
    <EditorForm<HomepageInput, Page>
      schema={homepageSchema}
      defaultValues={defaultValues}
      action={saveHomePage}
      successMessage="Homepage saved"
      submitLabel="Save homepage"
    >
      <FormSection title="Hero" description="The first thing visitors see.">
        <FormField name="heroEyebrow" label="Eyebrow" description="Small line above the headline.">
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="Student-led creativity & care" />
          )}
        </FormField>

        <FormField name="heroTitle" label="Headline" required>
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="Every child deserves a canvas." />
          )}
        </FormField>

        <FormField name="heroDescription" label="Introduction">
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={3} />}
        </FormField>

        <FormField
          name="heroSecondaryCtaLabel"
          label="Secondary button"
          description="The outline button beside the main one. Leave both fields empty to hide it."
        >
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="Explore our journey" />
          )}
        </FormField>

        <FormField
          name="heroSecondaryCtaHref"
          label="Secondary button link"
          description="Hidden automatically while that page isn't built yet."
        >
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="/our-journey" />
          )}
        </FormField>
      </FormSection>

      <FormSection
        title="Hero image"
        description="A landscape or square photograph works best. Needs guardian consent if children are identifiable."
      >
        <ImageFormField name="heroMediaId" label="Hero image" folder="hero" initialUrl={heroUrl} />
      </FormSection>

      <FormSection title="Mission" description="The section directly beneath the hero.">
        <FormField name="missionEyebrow" label="Eyebrow">
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="About us" />
          )}
        </FormField>
        <FormField name="missionTitle" label="Headline">
          {({ field, controlProps }) => <Input {...field} {...controlProps} />}
        </FormField>
        <FormField name="missionDescription" label="Description">
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={4} />}
        </FormField>

        <FormField name="missionPillarOneTitle" label="First card — title">
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="Our mission" />
          )}
        </FormField>
        <FormField name="missionPillarOneBody" label="First card — text">
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={2} />}
        </FormField>
        <FormField name="missionPillarTwoTitle" label="Second card — title">
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="Our vision" />
          )}
        </FormField>
        <FormField name="missionPillarTwoBody" label="Second card — text">
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={2} />}
        </FormField>
      </FormSection>

      <FormSection
        title="Programs section"
        description="The heading above the featured programs. Which programs appear is set on each program."
      >
        <FormField name="programsEyebrow" label="Eyebrow">
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="Featured programs" />
          )}
        </FormField>
        <FormField name="programsTitle" label="Headline">
          {({ field, controlProps }) => <Input {...field} {...controlProps} />}
        </FormField>
        <FormField name="programsDescription" label="Description">
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={2} />}
        </FormField>
      </FormSection>

      <FormSection title="Gallery section" description="The heading above the gallery preview.">
        <FormField name="galleryEyebrow" label="Eyebrow">
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="Gallery" />
          )}
        </FormField>
        <FormField name="galleryTitle" label="Headline">
          {({ field, controlProps }) => <Input {...field} {...controlProps} />}
        </FormField>
      </FormSection>

      <FormSection
        title="Voices"
        description="The large pull quote above the testimonials. Testimonials themselves are separate items."
      >
        <FormField name="voicesQuote" label="Quote">
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={2} />}
        </FormField>
        <FormField name="voicesAuthor" label="Attribution">
          {({ field, controlProps }) => <Input {...field} {...controlProps} />}
        </FormField>
      </FormSection>

      <FormSection
        title="Impact"
        description="The figures themselves are separate items; this is the copy around them."
      >
        <FormField name="impactEyebrow" label="Eyebrow">
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="Our impact" />
          )}
        </FormField>
        <FormField
          name="impactTitle"
          label="Headline"
          description="Wrap a word in *asterisks* to show it in the brand italic — e.g. Small hands, *steady* work."
        >
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="Small hands, *steady* work." />
          )}
        </FormField>
        <FormField name="impactDescription" label="Description">
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={3} />}
        </FormField>
        <FormField name="impactQuote" label="Volunteer quote">
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={2} />}
        </FormField>
        <FormField name="impactQuoteAttribution" label="Quote attribution">
          {({ field, controlProps }) => <Input {...field} {...controlProps} />}
        </FormField>
      </FormSection>

      <FormSection
        title="How to help"
        description="The in-kind donation section. The three item categories are fixed."
      >
        <FormField name="helpEyebrow" label="Eyebrow">
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="How to help" />
          )}
        </FormField>
        <FormField name="helpTitle" label="Headline">
          {({ field, controlProps }) => <Input {...field} {...controlProps} />}
        </FormField>
        <FormField name="helpDescription" label="Description">
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={3} />}
        </FormField>
        <FormField
          name="helpMethods"
          label="Collection methods"
          description="One per line. Each appears as a ticked item."
        >
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={3} />}
        </FormField>
        <FormField name="helpCtaLabel" label="Button label">
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="Message us to donate" />
          )}
        </FormField>
        <FormField name="helpCtaHref" label="Button link">
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="https://www.instagram.com/…" />
          )}
        </FormField>
      </FormSection>

      <FormSection
        title="Featured content"
        description="Managed where each item lives, so there is one place to edit each thing."
      >
        <ul className="flex flex-col gap-2 text-small text-muted-foreground">
          <li>
            Featured programs → mark a program as featured in{" "}
            <Link href="/admin/programs" className="text-primary hover:underline">
              Programs
            </Link>
          </li>
          <li>
            Featured gallery images → mark an image as featured in{" "}
            <Link href="/admin/gallery" className="text-primary hover:underline">
              Gallery
            </Link>
          </li>
          <li>
            Primary button and campaign band →{" "}
            <Link href="/admin/settings" className="text-primary hover:underline">
              Site settings
            </Link>
          </li>
        </ul>
      </FormSection>

      <FormSection title="Search engines" description="How the homepage appears in search results.">
        <FormField name="metaTitle" label="Meta title">
          {({ field, controlProps }) => <Input {...field} {...controlProps} maxLength={70} />}
        </FormField>
        <FormField name="metaDescription" label="Meta description">
          {({ field, controlProps }) => (
            <Textarea {...field} {...controlProps} rows={2} maxLength={160} />
          )}
        </FormField>
      </FormSection>
    </EditorForm>
  );
}
