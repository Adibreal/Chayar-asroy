import { AdminPageHeader } from "@/components/admin";
import { listGalleryItems } from "@/server/actions/gallery-actions";
import { requireEditor } from "@/server/auth/session";

import { GalleryManager } from "./gallery-manager";

export const metadata = { title: "Gallery" };

/** Gallery editor. Items are images plus their caption, credit and ordering. */
export default async function GalleryPage() {
  const user = await requireEditor();
  const result = await listGalleryItems();

  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Photographs shown on the website. Images need verified guardian consent before they can be published."
      />
      <GalleryManager
        initialItems={result.ok ? result.data : []}
        role={user.role}
        loadError={result.ok ? null : result.error.message}
      />
    </>
  );
}
