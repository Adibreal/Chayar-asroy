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
import { fromLines } from "@/lib/utils";
import { createProgram, updateProgram } from "@/server/actions/program-actions";
import type { Program } from "@/types/database";
import { programSchema, programUpdateSchema, type ProgramInput } from "@/validation/content";

/**
 * Create/edit form for a program.
 *
 * One component serves both routes — "new" and "edit" differ only in the
 * action and defaults, so there is no duplicated form markup.
 *
 * Everything here is assembly: `EditorForm` owns submission and the save bar,
 * `FormField` owns labelling and errors, `ImageFormField` owns media selection.
 */
export function ProgramForm({
  program,
  coverUrl,
  secondaryActions,
}: {
  program?: Program;
  coverUrl?: string | null;
  secondaryActions?: React.ReactNode;
}) {
  const isEdit = Boolean(program);

  const defaultValues = {
    slug: program?.slug ?? "",
    title: program?.title ?? "",
    category: program?.category ?? "art",
    summary: program?.summary ?? "",
    body: program?.body ?? "",
    activities: program?.activities ?? "",
    coverMediaId: program?.cover_media_id ?? undefined,
    eventDate: program?.event_date ?? undefined,
    location: program?.location ?? "",
    participation: program?.participation ?? "",
    // `text[]` in the database, one-per-line in the form.
    objectives: fromLines(program?.objectives),
    volunteers: fromLines(program?.volunteers),
    orderIndex: program?.order_index ?? 0,
    isFeatured: program?.is_featured ?? false,
    status: program?.status ?? "draft",
    metaTitle: program?.meta_title ?? "",
    metaDescription: program?.meta_description ?? "",
    ...(isEdit ? { id: program?.id } : {}),
  } as never;

  return (
    <EditorForm<ProgramInput & { id?: string }, Program>
      schema={isEdit ? programUpdateSchema : programSchema}
      defaultValues={defaultValues}
      action={isEdit ? updateProgram : createProgram}
      successMessage={isEdit ? "Program saved" : "Program created"}
      redirectTo={isEdit ? undefined : "/admin/programs"}
      submitLabel={isEdit ? "Save changes" : "Create program"}
      secondaryActions={secondaryActions}
    >
      <FormSection title="Details" description="How this program appears on the website.">
        <FormField name="title" label="Title" required>
          {({ field, controlProps }) => <Input {...field} {...controlProps} />}
        </FormField>

        <FormField
          name="slug"
          label="Slug"
          required
          description="Used in the web address. Lowercase letters, numbers and hyphens."
        >
          {({ field, controlProps }) => <Input {...field} {...controlProps} />}
        </FormField>

        <FormField name="category" label="Category" required>
          {({ field, controlProps }) => (
            <select
              {...field}
              {...controlProps}
              className="h-11 w-full rounded-lg border border-input bg-surface px-3 text-body outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35"
            >
              <option value="art">Art</option>
              <option value="education">Education</option>
              <option value="community">Community</option>
            </select>
          )}
        </FormField>

        <FormField name="summary" label="Summary" required description="Shown on cards and lists.">
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={3} />}
        </FormField>

        <FormField
          name="body"
          label="Overview"
          description="The full story of the programme. Leave a blank line between paragraphs; wrap a word in *asterisks* for emphasis."
        >
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={10} />}
        </FormField>

        <FormField
          name="activities"
          label="Activities"
          description="What actually happened on the day. Same formatting as the overview."
        >
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={8} />}
        </FormField>
      </FormSection>

      <FormSection
        title="When and where"
        description="Shown beneath the title on the programme page, and on its card."
      >
        <FormField name="eventDate" label="Date">
          {({ field, controlProps }) => <Input {...field} {...controlProps} type="date" />}
        </FormField>
        <FormField name="location" label="Location">
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="Mirpur, Dhaka" />
          )}
        </FormField>
        <FormField
          name="participation"
          label="Participation"
          description="Describe reach in your own words. Only figures you can evidence."
        >
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder="45 children, 8 volunteers" />
          )}
        </FormField>
      </FormSection>

      <FormSection title="Objectives" description="What the programme set out to do. One per line.">
        <FormField name="objectives" label="Objectives">
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={5} />}
        </FormField>
      </FormSection>

      <FormSection
        title="Volunteers"
        description="Credit the people who made it happen. One name per line."
      >
        <FormField name="volunteers" label="Volunteers">
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={5} />}
        </FormField>
      </FormSection>

      <FormSection title="Cover image">
        <ImageFormField name="coverMediaId" label="Cover" folder="programs" initialUrl={coverUrl} />
      </FormSection>

      <FormSection
        title="Programme gallery"
        description="Add images in the Gallery editor and set their Programme to this one. They appear in the gallery at the bottom of the programme page."
      >
        <p className="text-small text-muted-foreground">
          Images live in the shared media library, so the same photograph can be used here and
          elsewhere without uploading it twice.
        </p>
      </FormSection>

      <FormSection title="Publishing">
        <CheckboxFormField
          name="isFeatured"
          label="Feature on the homepage"
          description="Featured programs appear in the Featured programs section of the homepage."
        />

        <FormField name="status" label="Status">
          {({ field, controlProps }) => (
            <select
              {...field}
              {...controlProps}
              className="h-11 w-full rounded-lg border border-input bg-surface px-3 text-body outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35"
            >
              <option value="draft">Draft — only visible here</option>
              <option value="published">Published — live on the website</option>
              <option value="archived">Archived — hidden, kept for reference</option>
            </select>
          )}
        </FormField>

        <FormField
          name="orderIndex"
          label="Display order"
          description="Lower numbers appear first."
        >
          {({ field, controlProps }) => (
            <Input {...field} {...controlProps} type="number" min={0} className="max-w-32" />
          )}
        </FormField>
      </FormSection>

      <FormSection
        title="Search engines"
        description="Optional. Falls back to the title and summary."
      >
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
