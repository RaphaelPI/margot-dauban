import { type CollectionConfig, slugField } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '@/access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status'] },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  versions: { drafts: true },
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    slugField({ useAsSlug: 'title' }),
    { name: 'content', label: 'Contenu', type: 'richText' },
  ],
}
