import path from "node:path";

import type { NextConfig } from "next";

/**
 * Baseline security headers applied to every route.
 *
 * A full Content-Security-Policy is intentionally deferred until the app has a
 * settled set of first/third-party origins (Supabase, analytics, fonts). It
 * will be added — ideally nonce-based — in a later hardening pass so it can be
 * tested against real pages rather than an empty shell.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
] as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root. Without this, Next infers it from the nearest
  // lockfile and can pick up an unrelated one outside the project (e.g. in the
  // user's home directory), which breaks output file tracing.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Supabase Storage is the planned media source (Phase 3+).
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: [...securityHeaders] }];
  },
};

export default nextConfig;
