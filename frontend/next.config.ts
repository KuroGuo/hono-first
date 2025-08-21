import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { staleTimes: { dynamic: 60 * 60 * 24 * 8, static: 60 * 60 * 24 * 8 } },
  transpilePackages: ['@tanstack/query-core', 'viem']
}

export default nextConfig