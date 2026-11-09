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
  // URLs of the former WordPress site (margotdauban.fr) that changed: old links, bookmarks and
  // search results land on the new page (308). Unchanged: /, /contact, /faq, /projets, and text
  // pages (/mentions-legales, /politique-de-confidentialite) served by /[slug].
  async redirects() {
    return [
      // « Prestations » is now « Expertises ».
      { source: '/prestations', destination: '/expertises', permanent: true },
      // Case studies lived at the root; they now live under /projets (same slug).
      {
        source: `/:slug(${formerProjectSlugs.join('|')})`,
        destination: '/projets/:slug',
        permanent: true,
      },
      // Elementor header/footer templates were indexed by the old sitemap.
      { source: '/elementor-hf/:path*', destination: '/', permanent: true },
    ]
  },
}

// Project slugs of the former site (its page-sitemap.xml, Nov. 2026).
const formerProjectSlugs = [
  'axis-vision',
  'bubo-cybersec',
  'cinemas-utopia',
  'datashelter',
  'le-bikini',
  'le-site-immo',
  'powpowpiau',
  'pro-clean-horizon',
  'stafy',
  'stafy-plateforme',
  'triple-zero',
  'ze-watt',
]

export default withPayload(nextConfig, { devBundleServerPackages: false })
