import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  images: {
    remotePatterns: [
      {

        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {

        protocol: 'https',
        hostname: 'pduwvecnodnasjdqqngz.supabase.co',
      },
    ],
  },
};

export default nextConfig;