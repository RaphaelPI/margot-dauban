import { type CollectionConfig, slugField } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '@/access'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Projet', plural: 'Projets' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'client', 'year', '_status'] },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  versions: { drafts: true },
  defaultSort: '-year',
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    slugField({ useAsSlug: 'title' }),
    { name: 'summary', label: 'Résumé', type: 'textarea', required: true },
    { name: 'cover', label: 'Image de couverture', type: 'upload', relationTo: 'media', required: true },
    {
      type: 'row',
      fields: [
        { name: 'client', label: 'Client', type: 'text' },
        { name: 'year', label: 'Année', type: 'number', min: 1990, max: 2100 },
        { name: 'role', label: 'Rôle', type: 'text' },
      ],
    },
    { name: 'tags', label: 'Tags', type: 'text', hasMany: true },
    { name: 'content', label: 'Contenu', type: 'richText' },
  ],
}
