import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // This is for Google profile pictures
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        // This is for the custom pictures you upload to Supabase Storage
        protocol: 'https',
        hostname: 'pduwvecnodnasjdqqngz.supabase.co',
      },
    ],
  },
};

export default nextConfig;
