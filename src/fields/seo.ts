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

// Puts a page's fields in a « Contenu » tab and its SEO in its own « SEO » tab (designer's rule:
// SEO always in a separate tab). Unnamed tabs: the stored data keeps the same shape.
export const withSeoTab = (fields: Field[], contentLabel = 'Contenu'): Field[] => [
  {
    type: 'tabs',
    tabs: [
      { label: contentLabel, fields },
      { label: 'SEO', fields: [seoField] },
    ],
  },
]

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
