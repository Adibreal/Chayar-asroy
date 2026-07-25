import { notFound } from "next/navigation";

import { AdminPageHeader, StatusBadge } from "@/components/admin";
import { requireEditor } from "@/server/auth/session";
import { getMediaUrl } from "@/server/media-url";
import { programsRepository } from "@/server/repositories";

import { ProgramForm } from "../program-form";

export const metadata = { title: "Edit program" };

/** Edit one program. Reuses the same form component as the "new" route. */
export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  await requireEditor();
  const { id } = await params;

  const program = await programsRepository.findOptional("id", id);
  if (!program) notFound();

  // Resolve the cover's public URL so the form can show a preview.
  const coverUrl = await getMediaUrl(program.cover_media_id);

  return (
    <>
      <AdminPageHeader
        title={program.title}
        description={`/${program.slug}`}
        actions={<StatusBadge status={program.status} />}
      />
      <ProgramForm program={program} coverUrl={coverUrl} />
    </>
  );
}
