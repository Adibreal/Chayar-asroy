import { AdminPageHeader } from "@/components/admin";
import { listGalleryItems } from "@/server/actions/gallery-actions";
import { requireEditor } from "@/server/auth/session";
import { programsRepository } from "@/server/repositories";

import { GalleryManager } from "./gallery-manager";

export const metadata = { title: "Gallery" };

/** Gallery editor. Items are images plus their caption, credit and ordering. */
export default async function GalleryPage() {
  const user = await requireEditor();
  // Programmes are offered as the owning collection for each image, so the
  // gallery on a programme page is assembled here rather than in a second
  // image store.
  const [result, programs] = await Promise.all([
    listGalleryItems(),
    programsRepository.list({ pageSize: 200, orderBy: "title", ascending: true }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Photographs shown on the website. Images need verified guardian consent before they can be published."
      />
      <GalleryManager
        initialItems={result.ok ? result.data : []}
        programs={programs.rows.map(({ id, title }) => ({ id, title }))}
        role={user.role}
        loadError={result.ok ? null : result.error.message}
      />
    </>
  );
}
