import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Off on purpose: on, /admin loops to /admin/login on Vercel (docs/decisions.md #22).
  partialPrefetching: false,
  cacheLife: {
    // Model components and data lookups: cached forever on the server, refreshed ONLY when a
    // Payload hook expires their tag (src/lib/cache.ts). `stale` is the browser router cache.
    model: {
      stale: 60 * 5,
      revalidate: Infinity,
      expire: Infinity,
    },
  },
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
