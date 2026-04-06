import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**', // This allows all images from Unsplash
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;