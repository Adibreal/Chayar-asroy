import { AdminPageHeader } from "@/components/admin";
import { requireEditor } from "@/server/auth/session";
import { programsRepository } from "@/server/repositories";

import { ProgramsTable } from "./programs-table";

export const metadata = { title: "Programs" };

/**
 * Programs list. Reads table state from the URL and fetches exactly that page
 * on the server — the client component stays presentational.
 */
export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}) {
  const user = await requireEditor();
  const { q, sort, page } = await searchParams;

  const descending = sort?.startsWith("-") ?? false;
  const orderBy = sort ? sort.replace(/^-/, "") : "order_index";

  const result = await programsRepository.list({
    page: page ? Number(page) : 1,
    pageSize: 20,
    orderBy,
    ascending: !descending,
    ...(q ? { search: { term: q, columns: ["title", "slug", "summary"] } } : {}),
  });

  return (
    <>
      <AdminPageHeader
        title="Programs"
        description="The initiatives shown in the Programs section of the website."
      />
      <ProgramsTable
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
