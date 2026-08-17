import type { SVGProps } from "react";

/**
 * Hand-drawn line icons for the impact columns.
 *
 * Deliberately sketched rather than geometric — round caps, slightly loose
 * strokes — so they read as drawn by the students who run the programs, not as
 * a stock icon set. Single-colour via `currentColor`, decorative (`aria-hidden`)
 * because the adjacent number and label carry the meaning.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

/** Two children and a kite — the children we reach. */
export function ChildrenIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="16" cy="20" r="3" />
      <path d="M16 23v8M12 34l4-3 4 3M12.5 26.5 16 25l3.5 1.5" />
      <circle cx="27" cy="17" r="3" />
      <path d="M27 20v9M23 33l4-4 4 4M23.5 23.5 27 22l4 1.5" />
      <path d="m31 23 6-7" />
      <path d="m37 10 3.5 4-3.5 4-3.5-4z" />
    </svg>
  );
}

/** Two hands meeting — the volunteers who show up. */
export function HandsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 34V22a2 2 0 0 1 4 0v8" />
      <path d="M24 27v-3a2 2 0 0 1 4 0v6" />
      <path d="M28 28v-2a2 2 0 0 1 4 0v8a6 6 0 0 1-6 6h-3a6 6 0 0 1-6-6v-6a2 2 0 0 1 3-1.7" />
      <path d="M18 16.5 16 13M24 15v-4M30 16.5 32 13" />
    </svg>
  );
}

/** An open book with a brush — the workshops. */
export function WorkshopIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 15c5-2 9-2 14 1v18c-5-3-9-3-14-1z" />
      <path d="M36 15c-5-2-9-2-14 1v18c5-3 9-3 14-1z" />
      <path d="m34 12 5-5" />
      <path d="m38 6 4 4-2.5 2.5-4-4z" />
    </svg>
  );
}

/** A home beside a tree — the communities we return to. */
export function CommunityIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 24 17 17l9 7" />
      <path d="M11 23v11h12V23" />
      <path d="M15 34v-6h4v6" />
      <path d="M34 34V22" />
      <path d="M34 22c-4 0-6-2.5-6-6 4 0 6 2.5 6 6z" />
      <path d="M34 22c0-4.5 2.5-7 7-7 0 4.5-2.5 7-7 7z" />
    </svg>
  );
}

/** A collection jar gathering coins — what was raised. */
export function MoneyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* The coin going in — the gesture, drawn above the jar so the icon
          reads as *raising* rather than as a static container. */}
      <circle cx="24" cy="7" r="3.5" />
      {/* Lid, with its slot. */}
      <path d="M12.5 14h23v5h-23z" />
      <path d="M21 16.5h6" />
      {/* Jar. */}
      <path d="M15 19v15a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V19" />
      {/* What has gathered inside. */}
      <circle cx="24.25" cy="27" r="2.5" />
      <circle cx="21" cy="32.5" r="2.5" />
      <circle cx="27.5" cy="32.5" r="2.5" />
    </svg>
  );
}

/** A wrapped parcel — the donations that arrive. */
export function DonationIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* The bow, two loops meeting on the lid. */}
      <path d="M24 17.5c-1.2-2.7-2.9-4.6-5-4.6a2.6 2.6 0 0 0 0 5.2z" />
      <path d="M24 17.5c1.2-2.7 2.9-4.6 5-4.6a2.6 2.6 0 0 1 0 5.2z" />
      {/* Lid. */}
      <path d="M11.5 17.5h25v6h-25z" />
      {/* Box. */}
      <path d="M14 23.5v13a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-13" />
      {/* Ribbon. */}
      <path d="M24 23.5v15" />
    </svg>
  );
}

/**
 * Registry so content can reference an icon by name (CMS-friendly).
 *
 * Adding a name here is the *whole* job of adding an icon — `impact_stats.icon`
 * is free text precisely so a new glyph never needs a migration. Keep the
 * mirror list in `src/server/content/home.ts` in step, which is what decides
 * whether a stored name is recognised at all.
 */
export const impactIcons = {
  children: ChildrenIcon,
  hands: HandsIcon,
  workshop: WorkshopIcon,
  community: CommunityIcon,
  money: MoneyIcon,
  donation: DonationIcon,
} as const;

export type ImpactIconName = keyof typeof impactIcons;
