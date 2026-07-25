import type { Metadata, Viewport } from "next";
import { Inter, Noto_Serif_Bengali, Playfair_Display } from "next/font/google";

import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { AppProviders } from "@/providers";
import { buildMetadata } from "@/lib/seo/metadata";
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

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: "#f6eedd",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, playfair.variable, notoBengali.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        <a
          href="#main-content"
          className="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[var(--z-toast)]"
        >
          Skip to content
        </a>
        <AppProviders>
          <div className="flex min-h-dvh flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
