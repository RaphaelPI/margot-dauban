import type { CollectionConfig } from 'payload'
import { loggedIn } from '@/access'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'Question', plural: 'FAQ' },
  admin: { useAsTitle: 'question', defaultColumns: ['question', 'category'] },
  access: { read: () => true, create: loggedIn, update: loggedIn, delete: loggedIn },
  orderable: true,
  fields: [
    { name: 'question', label: 'Question', type: 'text', required: true },
    { name: 'answer', label: 'Réponse', type: 'richText', required: true },
    {
      name: 'category',
      label: 'Catégorie',
      type: 'select',
      required: true,
      options: [
        { label: 'Général', value: 'general' },
        { label: 'Services et expertise', value: 'services' },
        { label: 'Zone d’intervention et collaboration', value: 'collaboration' },
        { label: 'Tarifs et devis', value: 'pricing' },
        { label: 'Processus et méthodologie', value: 'process' },
        { label: 'Contact et délais', value: 'contact' },
      ],
    },
  ],
}
