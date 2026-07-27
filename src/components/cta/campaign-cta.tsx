import type { SiteCta, SiteContent } from "@/server/content/site";

import { CTASection } from "./cta-section";
import { PrimaryCta } from "./primary-cta";

type CampaignCTAProps = {
  /** The current campaign from Site settings. Renders nothing when absent. */
  campaign: SiteContent["campaign"];
  /** The shared primary CTA, used as the band's button. */
  cta: SiteCta | null;
  className?: string;
};

/**
 * The current-campaign CTA band — the cobalt `CTASection` driven entirely by
 * the campaign fields in Site settings plus the shared `PrimaryCta`. Editing
 * the campaign re-themes the band (donation drive, winter campaign,
 * recruitment…) with an unchanged layout. Reusable on any page.
 *
 * Renders nothing when no campaign is set, so a page can drop the band simply
 * by clearing it in the CMS.
 */
export function CampaignCTA({ campaign, cta, className }: CampaignCTAProps) {
  if (!campaign) return null;

  return (
    <CTASection
      eyebrow={campaign.eyebrow ?? undefined}
      title={campaign.title}
      description={campaign.description ?? undefined}
      actions={<PrimaryCta cta={cta} size="lg" variant="accent" />}
      className={className}
    />
  );
}
