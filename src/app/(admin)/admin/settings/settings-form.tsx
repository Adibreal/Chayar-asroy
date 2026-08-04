"use client";

import {
  CheckboxFormField,
  EditorForm,
  FormField,
  FormSection,
  ImageFormField,
} from "@/components/admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveSiteSettings } from "@/server/actions/settings-actions";
import type { SiteSettings } from "@/types/database";
import { siteSettingsSchema, type SiteSettingsInput } from "@/validation/content";

/**
 * Global site configuration.
 *
 * These values replace the hardcoded ones in `src/config/site.ts` — once the
 * public site reads from here (Phase 5D), nothing that belongs in this form
 * should live in code.
 */
export function SettingsForm({
  settings,
  logoUrl,
  campaignUrl,
}: {
  settings: SiteSettings | null;
  logoUrl?: string | null;
  campaignUrl?: string | null;
}) {
  const defaultValues = {
    orgName: settings?.org_name ?? "Chayar Asroy",
    orgNameBn: settings?.org_name_bn ?? "",
    tagline: settings?.tagline ?? "",
    description: settings?.description ?? "",
    contactEmail: settings?.contact_email ?? "",
    contactPhone: settings?.contact_phone ?? "",
    location: settings?.location ?? "",
    logoMediaId: settings?.logo_media_id ?? undefined,
    primaryCtaLabel: settings?.primary_cta_label ?? "",
    primaryCtaHref: settings?.primary_cta_href ?? "",
    primaryCtaEnabled: settings?.primary_cta_enabled ?? true,
    campaignEyebrow: settings?.campaign_eyebrow ?? "",
    campaignTitle: settings?.campaign_title ?? "",
    campaignDescription: settings?.campaign_description ?? "",
    campaignMediaId: settings?.campaign_media_id ?? undefined,
    defaultMetaTitle: settings?.default_meta_title ?? "",
    defaultMetaDescription: settings?.default_meta_description ?? "",
  } as never;

  return (
    <EditorForm<SiteSettingsInput, SiteSettings>
      schema={siteSettingsSchema}
      defaultValues={defaultValues}
      action={saveSiteSettings}
      successMessage="Settings saved"
      submitLabel="Save settings"
    >
      <FormSection title="Organisation" description="Used in the header, footer and page titles.">
        <FormField name="orgName" label="Name" required>
          {({ field, controlProps }) => <Input {...field} {...controlProps} />}
        </FormField>
        <FormField name="orgNameBn" label="Name (Bengali)">
          {({ field, controlProps }) => <Input {...field} {...controlProps} lang="bn" />}
        </FormField>
        <FormField name="tagline" label="Tagline">
          {({ field, controlProps }) => <Input {...field} {...controlProps} />}
        </FormField>
        <FormField
          name="description"
          label="Description"
          description="Used in the footer and as the default SEO description."
        >
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={3} />}
        </FormField>
      </FormSection>

      <FormSection title="Logo">
        <ImageFormField name="logoMediaId" label="Logo" folder="general" initialUrl={logoUrl} />
      </FormSection>

      <FormSection title="Contact" description="Shown in the footer and on the contact page.">
        <FormField name="contactEmail" label="Email">
          {({ field, controlProps }) => <Input {...field} {...controlProps} type="email" />}
        </FormField>
        <FormField name="contactPhone" label="Phone">
          {({ field, controlProps }) => <Input {...field} {...controlProps} type="tel" />}
        </FormField>
        <FormField name="location" label="Location">
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="Dhaka, Bangladesh" />
          )}
        </FormField>
      </FormSection>

      <FormSection
        title="Primary call to action"
        description="The single button reused by the header, hero and campaign band."
      >
        <FormField name="primaryCtaLabel" label="Button text">
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="Support our work" />
          )}
        </FormField>
        <FormField
          name="primaryCtaHref"
          label="Link"
          description="A path (/get-involved), an anchor (#how-to-help) or a full URL."
        >
          {({ field, controlProps }) => <Input {...field} {...controlProps} />}
        </FormField>

        <CheckboxFormField
          name="primaryCtaEnabled"
          label="Show the primary button"
          description="Turn off between campaigns to hide it everywhere at once."
        />
      </FormSection>

      <FormSection
        title="Current campaign"
        description="Shown in the highlighted band near the foot of the homepage. The background photograph is heavily blurred under a dark wash, so warmth and colour matter far more than composition — leave it empty to use the brand placeholder."
      >
        <FormField name="campaignEyebrow" label="Eyebrow">
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="Join us" />
          )}
        </FormField>
        <FormField name="campaignTitle" label="Headline">
          {({ field, controlProps }) => <Input {...field} {...controlProps} />}
        </FormField>
        <FormField name="campaignDescription" label="Description">
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={3} />}
        </FormField>

        <ImageFormField
          name="campaignMediaId"
          label="Background photograph"
          folder="general"
          initialUrl={campaignUrl}
        />
      </FormSection>

      <FormSection
        title="Search engine defaults"
        description="Used when a page doesn't set its own."
      >
        <FormField name="defaultMetaTitle" label="Meta title">
          {({ field, controlProps }) => <Input {...field} {...controlProps} maxLength={70} />}
        </FormField>
        <FormField name="defaultMetaDescription" label="Meta description">
          {({ field, controlProps }) => (
            <Textarea {...field} {...controlProps} rows={2} maxLength={160} />
          )}
        </FormField>
      </FormSection>
    </EditorForm>
  );
}
