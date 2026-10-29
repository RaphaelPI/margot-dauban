import type { Field } from 'payload'

export const seoField: Field = {
  name: 'seo',
  label: 'SEO',
  type: 'group',
  admin: { description: 'Laisser vide pour utiliser le titre et le résumé.' },
  fields: [
    { name: 'title', label: 'Titre (onglet et Google)', type: 'text' },
    { name: 'description', label: 'Description (Google)', type: 'textarea', maxLength: 160 },
    { name: 'image', label: 'Image de partage', type: 'upload', relationTo: 'media' },
  ],
}

export const linkFields: Field[] = [
  {
    type: 'row',
    fields: [
      { name: 'label', label: 'Libellé', type: 'text', required: true },
      {
        name: 'href',
        label: 'Lien',
        type: 'text',
        required: true,
        admin: { description: '/projets, https://…, mailto:…' },
      },
    ],
  },
]
