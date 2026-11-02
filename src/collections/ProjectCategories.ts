import { type CollectionConfig, slugField } from 'payload'
import { loggedIn } from '@/access'

export const ProjectCategories: CollectionConfig = {
  slug: 'project-categories',
  labels: { singular: 'Catégorie de projets', plural: 'Catégories de projets' },
  admin: {
    useAsTitle: 'title',
    description: 'Filtres de la page Projets, dans cet ordre (glisser-déposer pour réordonner).',
  },
  access: { read: () => true, create: loggedIn, update: loggedIn, delete: loggedIn },
  orderable: true,
  fields: [
    {
      name: 'title',
      label: 'Nom',
      type: 'text',
      required: true,
      admin: { description: 'Ex. SaaS & logiciels métier' },
    },
    slugField({ useAsSlug: 'title' }),
  ],
}
