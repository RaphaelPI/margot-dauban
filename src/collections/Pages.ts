import { type CollectionConfig, slugField } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '@/access'
import { seoField } from '@/fields/seo'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
    description: 'Pages de texte : à propos, mentions légales, confidentialité…',
  },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  versions: { drafts: true },
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    slugField({ useAsSlug: 'title' }),
    { name: 'content', label: 'Contenu', type: 'richText' },
    seoField,
  ],
}
