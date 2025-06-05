import type { NextConfig } from 'next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.gravatar.com',
      },
    ],
  },
};

export default nextConfig;
