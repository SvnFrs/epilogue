import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Standalone output is Docker-only (env-gated). `next start` is unreliable with
  // standalone (stale-chunk "Cannot find module ./NNN.js"), so local dev/e2e/build use
  // Next's normal output where `next start` works. The Docker build sets NEXT_STANDALONE=1.
  output: process.env.NEXT_STANDALONE === '1' ? 'standalone' : undefined,
  reactStrictMode: true,
  // The api type is consumed from a workspace TS package via Eden.
  transpilePackages: ['@epilogue/contracts', '@epilogue/api'],
  // We run ESLint via the workspace flat config (bun run lint), not Next's built-in pass.
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // server actions stay OFF by design (security decision; plan.md).
  },
};

export default nextConfig;
