import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgproxy.attic.sh",
      },
      {
        protocol: "https",
        hostname: "attic.sh",
      },
    ],
  },
};

export default nextConfig;
