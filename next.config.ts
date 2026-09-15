import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // No `output: "standalone"` — deployment is via @opennextjs/cloudflare,
  // which builds straight off the default `.next` output, not a standalone bundle.
  turbopack: {
    root: path.join(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static-cdn.jtvnw.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
