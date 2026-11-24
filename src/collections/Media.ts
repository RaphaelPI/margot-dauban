import type { CollectionConfig } from 'payload'
import { loggedIn } from '@/access'

// Widths generated once at upload (sharp, WebP) and served as a `srcset` by `MediaImage`: no
// image transformation at request time (Vercel's optimizer is off, docs/decisions.md). From a
// 48px avatar to the 1176px case-study hero at 2x. Never upscaled: an original narrower than a
// width simply has no file for it.
export const mediaWidths = { xs: 160, sm: 480, md: 960, lg: 1440, xl: 2400 } as const

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Média', plural: 'Médias' },
  access: { read: () => true, create: loggedIn, update: loggedIn, delete: loggedIn },
  upload: {
    // application/json: Lottie animations (expertises). Played without expressions (no code runs).
    mimeTypes: ['image/*', 'video/*', 'application/json'],
    imageSizes: Object.entries(mediaWidths).map(([name, width]) => ({
      name,
      width,
      withoutEnlargement: true,
      formatOptions: { format: 'webp', options: { quality: 80 } },
    })),
    adminThumbnail: 'xs',
    // Files never change behind a URL: replacing a file gives it a new name (Payload adds -1,
    // -2…). So the Vercel CDN and browsers keep them a year; the function runs once per file.
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable')
      return headers
    },
  },
  fields: [
    {
      name: 'alt',
      label: 'Texte alternatif',
      type: 'text',
      required: true,
      admin: { description: "Décrit l'image pour les lecteurs d'écran et le SEO." },
    },
  ],
}
