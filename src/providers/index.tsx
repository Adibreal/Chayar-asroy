import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";

import { MotionProvider } from "./motion-provider";

/**
 * Composes all app-wide providers into a single wrapper used by the root
 * layout. Add future providers (theme, analytics, toasts) here so the layout
 * stays declarative and provider order lives in one place.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
    </MotionProvider>
  );
}
