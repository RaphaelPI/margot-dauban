import type { CollectionConfig } from 'payload'
import { loggedIn } from '@/access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Témoignage', plural: 'Témoignages' },
  admin: { useAsTitle: 'authorName', defaultColumns: ['authorName', 'company', 'project'] },
  access: { read: () => true, create: loggedIn, update: loggedIn, delete: loggedIn },
  orderable: true,
  fields: [
    { name: 'quote', label: 'Citation', type: 'textarea', required: true },
    {
      name: 'highlight',
      label: 'Phrase mise en avant',
      type: 'text',
      admin: {
        description: 'Suite de la citation affichée en accent, idéalement celle qui parle du résultat.',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'authorName', label: 'Prénom Nom', type: 'text', required: true },
        { name: 'authorRole', label: 'Poste', type: 'text' },
        { name: 'company', label: 'Entreprise', type: 'text' },
      ],
    },
    { name: 'photo', label: 'Photo', type: 'upload', relationTo: 'media' },
    { name: 'project', label: 'Projet lié', type: 'relationship', relationTo: 'projects' },
  ],
}
