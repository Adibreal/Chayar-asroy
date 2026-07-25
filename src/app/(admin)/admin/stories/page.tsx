import { AdminPageHeader } from "@/components/admin";
import { requireEditor } from "@/server/auth/session";
import { storiesRepository } from "@/server/repositories";

import { StoriesTable } from "./stories-table";

export const metadata = { title: "Stories" };

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}) {
  const user = await requireEditor();
  const { q, sort, page } = await searchParams;

  const descending = sort?.startsWith("-") ?? false;
  const orderBy = sort ? sort.replace(/^-/, "") : "created_at";

  const result = await storiesRepository.list({
    page: page ? Number(page) : 1,
    pageSize: 20,
    orderBy,
    ascending: sort ? !descending : false,
    ...(q ? { search: { term: q, columns: ["title", "slug", "excerpt"] } } : {}),
  });

  return (
    <>
      <AdminPageHeader
        title="Stories"
        description="Longer narratives about the children and volunteers you work with."
      />
      <StoriesTable
        rows={result.rows}
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        pageCount={result.pageCount}
        role={user.role}
      />
    </>
  );
}
