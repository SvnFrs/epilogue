import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Node-oriented standalone output for the Docker web image (plan.md).
  output: 'standalone',
  reactStrictMode: true,
  // The api type is consumed from a workspace TS package via Eden.
  transpilePackages: ['@epilogue/contracts', '@epilogue/api'],
  experimental: {
    // server actions stay OFF by design (security decision; plan.md).
  },
};

export default nextConfig;
