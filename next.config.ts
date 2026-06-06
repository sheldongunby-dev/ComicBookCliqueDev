import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./src/content/**/*"],
    "/**": ["./src/content/**/*"],
    "/": ["./src/content/**/*"]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.squarespace-cdn.com",
      },
      {
        protocol: "https",
        hostname: "static1.squarespace.com",
      },
      {
        protocol: "https",
        hostname: "open.spotify.com",
      },
      {
        protocol: "https",
        hostname: "images.teepublic.com",
      },
    ],
  },
};

export default nextConfig;
