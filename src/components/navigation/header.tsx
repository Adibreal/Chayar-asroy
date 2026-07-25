"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Logo } from "../brand/logo";
import { PrimaryCta } from "../cta/primary-cta";
import { siteConfig } from "@/config/site";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";

/**
 * Site header: sticky, transparent at the top and gaining a subtle blurred
 * background once scrolled. Desktop nav collapses into `MobileNav` on small
 * screens.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-header)] border-b transition-colors duration-[var(--duration-normal)]",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link
          href="/"
          aria-label={`${siteConfig.name} — home`}
          className={cn("rounded-md", focusRing)}
        >
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <PrimaryCta size="sm" className="hidden sm:inline-flex" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
