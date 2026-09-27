import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Self-contained server bundle for Docker (homelab). Vercel ignores this
     and uses its own build output. */
  output: "standalone",
  /* Pin the project root. Without this Next infers it from a stray
     lockfile higher up the filesystem on some machines. */
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },

  /* The site moved to its own subdomain. Send the old production address
     there permanently (301), path and query intact, so links and search
     rankings carry over and Google does not see two copies. Only this
     exact host matches: Vercel preview URLs and self-hosted copies are
     left alone. */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "nsu-bus-fare-calculator.vercel.app" }],
        destination: "https://nsu-bus.tahsinulmohsin.me/:path*",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
