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
import { createStory, updateStory } from "@/server/actions/story-actions";
import type { Story } from "@/types/database";
import { storySchema, storyUpdateSchema, type StoryInput } from "@/validation/content";

/**
 * Create/edit a story.
 *
 * Rich text is deliberately **Markdown in a textarea**: no heavy editor
 * dependency, the content stays portable plain text, and there is no risk of a
 * WYSIWYG producing markup the public site can't style. Revisit only if
 * volunteers actually ask for it.
 */
export function StoryForm({ story, heroUrl }: { story?: Story; heroUrl?: string | null }) {
  const isEdit = Boolean(story);

  const defaultValues = {
    slug: story?.slug ?? "",
    title: story?.title ?? "",
    excerpt: story?.excerpt ?? "",
    body: story?.body ?? "",
    heroMediaId: story?.hero_media_id ?? undefined,
    authorName: story?.author_name ?? "",
    orderIndex: story?.order_index ?? 0,
    isFeatured: story?.is_featured ?? false,
    status: story?.status ?? "draft",
    metaTitle: story?.meta_title ?? "",
    metaDescription: story?.meta_description ?? "",
    ...(isEdit ? { id: story?.id } : {}),
  } as never;

  return (
    <EditorForm<StoryInput & { id?: string }, Story>
      schema={isEdit ? storyUpdateSchema : storySchema}
      defaultValues={defaultValues}
      action={isEdit ? updateStory : createStory}
      successMessage={isEdit ? "Story saved" : "Story created"}
      redirectTo={isEdit ? undefined : "/admin/stories"}
      submitLabel={isEdit ? "Save changes" : "Create story"}
    >
      <FormSection title="Story">
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

        <FormField name="excerpt" label="Excerpt" required description="Shown on story cards.">
          {({ field, controlProps }) => <Textarea {...field} {...controlProps} rows={3} />}
        </FormField>

        <FormField
          name="body"
          label="Body"
          description="Markdown: **bold**, _italic_, # headings, - lists, [links](https://example.com)."
        >
          {({ field, controlProps }) => (
            <Textarea {...field} {...controlProps} rows={16} className="font-mono text-small" />
          )}
        </FormField>

        <FormField
          name="authorName"
          label="Author"
          description="Use a first name only when the story is about a child."
        >
          {({ field, controlProps }) => <Input {...field} {...controlProps} />}
        </FormField>
      </FormSection>

      <FormSection title="Cover image">
        <ImageFormField
          name="heroMediaId"
          label="Hero image"
          folder="stories"
          initialUrl={heroUrl}
        />
      </FormSection>

      <FormSection title="Publishing">
        <CheckboxFormField
          name="isFeatured"
          label="Feature on the homepage"
          description="Featured stories appear in the Stories section of the homepage."
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
        description="Optional. Falls back to the title and excerpt."
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
