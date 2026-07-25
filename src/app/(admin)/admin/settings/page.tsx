import { AdminPageHeader } from "@/components/admin";
import { getSiteSettings } from "@/server/actions/settings-actions";
import { requireAdmin } from "@/server/auth/session";
import { getMediaUrl } from "@/server/media-url";

import { SettingsForm } from "./settings-form";

export const metadata = { title: "Site settings" };

/** Global configuration. Admin-only — these values affect every page. */
export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  const logoUrl = await getMediaUrl(settings?.logo_media_id);

  return (
    <>
      <AdminPageHeader
        title="Site settings"
        description="Organisation details, contact information and site-wide defaults."
      />
      <SettingsForm settings={settings} logoUrl={logoUrl} />
    </>
  );
}
