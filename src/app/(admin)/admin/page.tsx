import { BookOpen, Image as ImageIcon, Settings, Sparkles } from "lucide-react";

import { AdminPageHeader, QuickAction, SummaryCard, Widget, WidgetGrid } from "@/components/admin";
import { EmptyState } from "@/components/ui/empty-state";
import { requireUser } from "@/server/auth/session";

export const metadata = { title: "Dashboard" };

/**
 * CMS home.
 *
 * Intentionally a *shell*: it demonstrates the dashboard blocks and gives a
 * first-time volunteer an orientation, but shows no invented statistics —
 * real counts arrive with the editors in Phase 5C.
 */
export default async function AdminDashboardPage() {
  const user = await requireUser();
  const firstName = user.full_name?.trim().split(/\s+/)[0] ?? "there";

  return (
    <>
      <AdminPageHeader
        title={`Welcome back, ${firstName}`}
        description="Manage the Chayar Asroy website from here. Choose a section in the sidebar to begin."
      />

      <WidgetGrid columns={3}>
        <SummaryCard label="Programs" value="—" hint="Available in the next phase" />
        <SummaryCard label="Gallery images" value="—" hint="Available in the next phase" />
        <SummaryCard label="Stories" value="—" hint="Available in the next phase" />
      </WidgetGrid>

      <Widget title="Quick actions">
        <div className="grid gap-3 sm:grid-cols-2">
          <QuickAction
            href="/admin"
            label="Add a program"
            description="Coming in the next phase"
            icon={<Sparkles />}
          />
          <QuickAction
            href="/admin"
            label="Upload images"
            description="Coming in the next phase"
            icon={<ImageIcon />}
          />
          <QuickAction
            href="/admin"
            label="Write a story"
            description="Coming in the next phase"
            icon={<BookOpen />}
          />
          <QuickAction
            href="/admin"
            label="Site settings"
            description="Coming in the next phase"
            icon={<Settings />}
          />
        </div>
      </Widget>

      <Widget title="Recent activity">
        <EmptyState
          title="Nothing here yet"
          description="Changes you and your team make to the website will appear here."
        />
      </Widget>
    </>
  );
}
