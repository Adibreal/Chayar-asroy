import { notFound } from "next/navigation";

import { AdminPageHeader, StatusBadge } from "@/components/admin";
import { requireEditor } from "@/server/auth/session";
import { getMediaUrl } from "@/server/media-url";
import { storiesRepository } from "@/server/repositories";

import { StoryForm } from "../story-form";

export const metadata = { title: "Edit story" };

export default async function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireEditor();
  const { id } = await params;

  const story = await storiesRepository.findOptional("id", id);
  if (!story) notFound();

  const heroUrl = await getMediaUrl(story.hero_media_id);

  return (
    <>
      <AdminPageHeader
        title={story.title}
        description={`/${story.slug}`}
        actions={<StatusBadge status={story.status} />}
      />
      <StoryForm story={story} heroUrl={heroUrl} />
    </>
  );
}
