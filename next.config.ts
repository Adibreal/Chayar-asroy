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
  /**
   * Keep credentials out of the dev server log.
   *
   * Next's dev request logger prints Server Action arguments, so a successful
   * sign-in wrote the user's **plaintext password** to the terminal:
   *
   *   └─ ƒ signIn({"email":"…","password":"…"}) in 1094ms
   *
   * That log is visible to anyone reading the terminal, a screen share or a CI
   * transcript. Suppressing request logging for the auth routes removes the
   * only path on which a raw credential reaches the log, while leaving request
   * logging intact everywhere else — it is genuinely useful for debugging.
   *
   * Dev-only (production does not log action arguments), but this project is
   * developed by rotating student volunteers who will run `pnpm dev` and share
   * screens, so it is worth closing.
   */
  logging: {
    incomingRequests: {
      ignore: [/^\/admin\/login/],
    },
  },
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
