import type { Metadata, Viewport } from "next";
import { Inter, Noto_Serif_Bengali, Playfair_Display } from "next/font/google";

import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { AppProviders } from "@/providers";
import { generateSiteMetadata } from "@/lib/seo/metadata";
import { getSiteContent } from "@/server/content/site";
import { cn } from "@/lib/utils";

import "./globals.css";

/** Body / UI sans. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Editorial display serif — the brand's signature headline voice. */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

/** Bengali type for the wordmark and Bengali content. */
const notoBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto-bengali",
  display: "swap",
  preload: false,
});

/**
 * Site-wide metadata from the CMS. `getSiteContent()` is request-cached, so
 * this shares a single fetch with the header and footer below.
 */
export function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata();
}

export const viewport: Viewport = {
  themeColor: "#f6eedd",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteContent();

  return (
    /*
     * `data-scroll-behavior="smooth"` tells Next.js that `globals.css` sets
     * `scroll-behavior: smooth`, so it switches smoothing off while it scrolls
     * during a navigation. Without it (Next 16 no longer does this by default)
     * the "Support our work" link to `/#how-to-help` changed the URL but the
     * page barely moved: two smooth scrolls interrupted each other.
     */
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(inter.variable, playfair.variable, notoBengali.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        {/*
          No-JS fallback for the scroll-in animations. Motion renders each
          element's starting state — `opacity:0` — into the server HTML and only
          animates it in once JavaScript runs, so without JS (blocked, failed,
          or a slow connection timing out) most of the page stayed invisible.
          This rule exists only when scripting is off, so animated visitors are
          unaffected. Matches Motion's inline style, so every animated element
          is covered without tagging each one.
        */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              '<style>main [style*="opacity:0"]{opacity:1!important;transform:none!important}</style>',
          }}
        />
        <a
          href="#main-content"
          className="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[var(--z-toast)]"
        >
          Skip to content
        </a>
        <AppProviders>
          <div className="flex min-h-dvh flex-col">
            <Header site={site} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer site={site} />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
