import type { CollectionConfig } from 'payload'
import { loggedIn } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Média', plural: 'Médias' },
  access: { read: () => true, create: loggedIn, update: loggedIn, delete: loggedIn },
  // application/json: Lottie animations (expertises). Played without expressions (no code runs).
  upload: { mimeTypes: ['image/*', 'video/*', 'application/json'] },
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
