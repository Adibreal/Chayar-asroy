import { AdminPageHeader } from "@/components/admin";
import { listMedia } from "@/server/actions/media-actions";
import { requireEditor } from "@/server/auth/session";

import { MediaLibrary } from "./media-library";

export const metadata = { title: "Media" };

/**
 * Media library. Fetches the first page on the server; the client component
 * owns interaction (search, upload, edit, delete).
 */
export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const user = await requireEditor();
  const { q, page } = await searchParams;

  const result = await listMedia({ search: q, page: page ? Number(page) : 1 });
  const data = result.ok ? result.data : { items: [], total: 0, page: 1, pageCount: 1 };

  return (
    <>
      <AdminPageHeader
        title="Media"
        description="Every image used across the website. Add alt text so the site stays accessible."
      />
      <MediaLibrary
        initialItems={data.items}
        total={data.total}
        role={user.role}
        loadError={result.ok ? null : result.error.message}
      />
    </>
  );
}
