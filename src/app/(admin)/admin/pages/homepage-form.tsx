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
    heroMediaId: content.heroMediaId ?? undefined,
    missionEyebrow: content.missionEyebrow ?? "",
    missionTitle: content.missionTitle ?? "",
    missionDescription: content.missionDescription ?? "",
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
