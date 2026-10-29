import type { CollectionConfig } from 'payload'
import { loggedIn } from '@/access'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { singular: 'Client', plural: 'Clients' },
  admin: { useAsTitle: 'name', description: "Références affichées sur l'accueil (bandeau)." },
  access: { read: () => true, create: loggedIn, update: loggedIn, delete: loggedIn },
  orderable: true,
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'SVG ou PNG transparent.' },
    },
    { name: 'url', label: 'Site', type: 'text' },
  ],
}
