import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {
    // Model components (src/components/models): content only changes when Payload
    // revalidates its tag (src/lib/cache.ts), so time-based refresh is a safety net.
    model: {
      stale: 60 * 5,
      revalidate: 60 * 60 * 24 * 365,
      expire: 60 * 60 * 24 * 366,
    },
  },
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
