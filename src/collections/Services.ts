import type { CollectionConfig } from 'payload'
import { loggedIn } from '@/access'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Expertise', plural: 'Expertises' },
  admin: { useAsTitle: 'title', description: 'Groupes de prestations (UX, UI, Branding…).' },
  access: { read: () => true, create: loggedIn, update: loggedIn, delete: loggedIn },
  orderable: true,
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'summary', label: 'Description', type: 'textarea' },
    {
      name: 'items',
      label: 'Prestations',
      type: 'text',
      hasMany: true,
      required: true,
      admin: { description: 'Liste complète (page Services).' },
    },
    {
      name: 'homeItems',
      label: "Prestations affichées sur l'accueil",
      type: 'text',
      hasMany: true,
      admin: { description: 'Version courte. Vide = liste complète.' },
    },
    { name: 'showOnHome', label: "Afficher sur l'accueil", type: 'checkbox', defaultValue: true },
  ],
}
