import { AdminPageHeader } from "@/components/admin";
import { requireEditor } from "@/server/auth/session";

import { ProgramForm } from "../program-form";

export const metadata = { title: "New program" };

export default async function NewProgramPage() {
  await requireEditor();

  return (
    <>
      <AdminPageHeader
        title="New program"
        description="Create a program. It stays a draft until you publish it."
      />
      <ProgramForm />
    </>
  );
}
