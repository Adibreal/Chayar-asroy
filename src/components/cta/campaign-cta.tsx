import { siteConfig } from "@/config/site";

import { CTASection } from "./cta-section";
import { PrimaryCta } from "./primary-cta";

/**
 * The current-campaign CTA band — the cobalt `CTASection` driven entirely by
 * `siteConfig.campaign` plus the shared `PrimaryCta`. Swapping the campaign in
 * config re-themes the band (donation drive, winter campaign, recruitment…)
 * with an unchanged layout. Reusable on any page.
 */
export function CampaignCTA({ className }: { className?: string }) {
  const { eyebrow, title, description } = siteConfig.campaign;

  return (
    <CTASection
      eyebrow={eyebrow}
      title={title}
      description={description}
      actions={<PrimaryCta size="lg" variant="accent" />}
      className={className}
    />
  );
}
