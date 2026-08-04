import { AdminPageHeader } from "@/components/admin";
import { getHomePage } from "@/server/actions/page-actions";
import { requireEditor } from "@/server/auth/session";
import { getMediaUrl } from "@/server/media-url";

import { HomepageForm } from "./homepage-form";

export const metadata = { title: "Homepage" };

/**
 * Page content. Today that's the homepage; further pages join this section as
 * they're built, using the same form pattern.
 */
export default async function PagesPage() {
  await requireEditor();
  const page = await getHomePage();

  const heroUrl = await getMediaUrl(page?.hero_media_id ?? undefined);

  return (
    <>
      <AdminPageHeader
        title="Homepage"
        description="The copy and imagery shown on the front page of the website."
      />
      <HomepageForm page={page} heroUrl={heroUrl} />
    </>
  );
}
