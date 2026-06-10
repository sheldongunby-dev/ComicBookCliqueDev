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
    ],
  },
};

export default nextConfig;
