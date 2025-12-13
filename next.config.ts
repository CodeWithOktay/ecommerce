import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google login resimleri için lazım olabilir
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Placeholder kullanıyorsan
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Varsayılan 1mb'dır, 10mb yaptık
    },
  },
};

export default nextConfig;
