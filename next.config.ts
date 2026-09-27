import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Self-contained server bundle for Docker (homelab). Vercel ignores this
     and uses its own build output. */
  output: "standalone",
  /* Pin the project root. Without this Next infers it from a stray
     lockfile higher up the filesystem on some machines. */
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },
};

export default nextConfig;
