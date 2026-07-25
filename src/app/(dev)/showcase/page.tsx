import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ShowcaseContent } from "./showcase-content";

export const metadata: Metadata = {
  title: "Design System Showcase",
  robots: { index: false, follow: false },
};

/**
 * Internal design-system showcase — available in development only. In
 * production it 404s so it never becomes part of the public site.
 */
export default function ShowcasePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ShowcaseContent />;
}
