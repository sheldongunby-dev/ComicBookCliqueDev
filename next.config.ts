import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.squarespace-cdn.com",
      },
      {
        protocol: "http",
        hostname: "images.squarespace-cdn.com",
      },
      {
        protocol: "https",
        hostname: "static1.squarespace.com",
      },
      {
        protocol: "http",
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
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev", // Cloudflare R2 default domains
      },
      // Note: If you configure a custom domain for R2 (e.g. media.comicbookclique.com),
      // you must add it here!
    ],
  },
};

export default nextConfig;
