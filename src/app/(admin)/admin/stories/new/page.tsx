import { AdminPageHeader } from "@/components/admin";
import { requireEditor } from "@/server/auth/session";

import { StoryForm } from "../story-form";

export const metadata = { title: "New story" };

export default async function NewStoryPage() {
  await requireEditor();

  return (
    <>
      <AdminPageHeader
        title="New story"
        description="Write a story. It stays a draft until you publish it."
      />
      <StoryForm />
    </>
  );
}
