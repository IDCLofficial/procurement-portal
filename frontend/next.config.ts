import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'procurement-temp.sirv.com',
      },
    ],
  },
};

export default nextConfig;
