import { FileText, Image as ImageIcon, Images, Settings, Sparkles } from "lucide-react";
import Link from "next/link";

import {
  AdminPageHeader,
  Can,
  QuickAction,
  StatusBadge,
  SummaryCard,
  Widget,
  WidgetGrid,
} from "@/components/admin";
import { EmptyState } from "@/components/ui/empty-state";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { requireUser } from "@/server/auth/session";
import { galleryItemsRepository, mediaRepository, programsRepository } from "@/server/repositories";

export const metadata = { title: "Dashboard" };

/** Plural-aware count, e.g. "1 photo" / "3 photos". */
const plural = (count: number, one: string, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`;

/** "14 Oct 2026" — pinned locale, like the public site's dates. */
const formatDay = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(iso),
  );

/**
 * CMS home: what's on the website right now, what needs a volunteer's
 * attention, and shortcuts to the everyday tasks.
 *
 * Every number is a live count (`head: true` — no rows fetched) under the
 * signed-in user's RLS, so it never shows more than they can open.
 */
export default async function AdminDashboardPage() {
  const user = await requireUser();
  const firstName = user.full_name?.trim().split(/\s+/)[0];

  const [
    programsTotal,
    programsPublished,
    galleryPublished,
    galleryDraft,
    mediaTotal,
    mediaWithoutAlt,
    mediaWithoutConsent,
    recentPrograms,
  ] = await Promise.all([
    programsRepository.count(),
    programsRepository.count({ status: "published" }),
    galleryItemsRepository.count({ status: "published" }),
    galleryItemsRepository.count({ status: "draft" }),
    mediaRepository.count(),
    mediaRepository.count({ alt_text: "" }),
    mediaRepository.count({ consent_verified: false }),
    programsRepository.list({ pageSize: 5, orderBy: "updated_at", ascending: false }),
  ]);

  // Things a volunteer should fix, phrased as what's missing.
  const mediaTodo = [
    mediaWithoutAlt > 0 ? `${plural(mediaWithoutAlt, "photo")} without a description` : null,
    mediaWithoutConsent > 0 ? `${plural(mediaWithoutConsent, "photo")} awaiting consent` : null,
  ].filter((item) => item !== null);

  return (
    <>
      <AdminPageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        description="Here's what's on the website right now. Choose a section in the sidebar, or start with a shortcut below."
      />

      <WidgetGrid columns={3}>
        <SummaryCard
          label="Programs"
          value={programsPublished}
          hint={
            programsTotal > programsPublished
              ? `published · ${programsTotal - programsPublished} more in draft or archived`
              : "published"
          }
          icon={<Sparkles />}
          href="/admin/programs"
        />
        <SummaryCard
          label="Gallery photos"
          value={galleryPublished}
          hint={galleryDraft > 0 ? `published · ${galleryDraft} in draft` : "published"}
          icon={<Images />}
          href="/admin/gallery"
        />
        <SummaryCard
          label="Media library"
          value={mediaTotal}
          hint={
            mediaTodo.length > 0
              ? `Needs attention: ${mediaTodo.join(" · ")}`
              : "All described and consented"
          }
          icon={<ImageIcon />}
          href="/admin/media"
        />
      </WidgetGrid>

      <Widget title="Shortcuts">
        <div className="grid gap-3 sm:grid-cols-2">
          <QuickAction
            href="/admin/programs/new"
            label="Add a program"
            description="Write up an event — it gets its own page on the site"
            icon={<Sparkles />}
          />
          <QuickAction
            href="/admin/media"
            label="Upload photos"
            description="Add photos, describe them and confirm consent"
            icon={<ImageIcon />}
          />
          <QuickAction
            href="/admin/gallery"
            label="Manage the gallery"
            description="Publish photos and attach them to a program"
            icon={<Images />}
          />
          <QuickAction
            href="/admin/pages"
            label="Edit the homepage"
            description="Headlines, text and the hero photo"
            icon={<FileText />}
          />
          <Can role={user.role} minimum="admin">
            <QuickAction
              href="/admin/settings"
              label="Site settings"
              description="Contact details, the main button and the campaign band"
              icon={<Settings />}
            />
          </Can>
        </div>
      </Widget>

      <Widget title="Recently edited programs">
        {recentPrograms.rows.length > 0 ? (
          <ul className="-my-2 divide-y divide-border">
            {recentPrograms.rows.map((program) => (
              <li key={program.id}>
                <Link
                  href={`/admin/programs/${program.id}`}
                  className={cn(
                    "-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface-hover",
                    focusRing,
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-small font-medium text-foreground">
                      {program.title}
                    </span>
                    <span className="block text-caption text-muted-foreground">
                      Edited {formatDay(program.updated_at)}
                    </span>
                  </span>
                  <StatusBadge status={program.status} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No programs yet"
            description="Programs you add will appear here, most recently edited first."
          />
        )}
      </Widget>
    </>
  );
}
