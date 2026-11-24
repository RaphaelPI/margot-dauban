import type { CollectionConfig } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '@/access'
import { titleText } from '@/fields/title-text'
import { previewUrl } from '@/lib/preview-url'

// Client testimonials: the « Témoignages » page (designs/89-page-temoignages) and the quote block
// of the linked project's page. Linked to a project, a testimonial takes its categories, sector,
// image and case study link from it; each can be overridden here.
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Témoignage', plural: 'Témoignages' },
  admin: {
    preview: () => previewUrl('/temoignages'),
    useAsTitle: 'author',
    defaultColumns: ['author', 'company', 'project', '_status'],
    description:
      'Page Témoignages, dans cet ordre (glisser-déposer pour réordonner), et page du projet relié.',
  },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  versions: { drafts: true },
  orderable: true,
  fields: [
    {
      name: 'project',
      label: 'Projet relié',
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        position: 'sidebar',
        description:
          'Reprend ses catégories, son secteur, son image et le lien « Voir le use case ». Le témoignage s’affiche aussi sur la page du projet.',
      },
    },
    {
      name: 'quote',
      label: 'Témoignage',
      ...titleText(),
      required: true,
      admin: {
        description:
          'Sans guillemets. Le texte en gras reste en gras sur la page Témoignages et s’affiche surligné en lilas sur la page du projet. Un retour à la ligne = un nouveau paragraphe. Les avis longs se replient (« Voir plus »).',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'author', label: 'Prénom Nom', type: 'text', required: true },
        { name: 'role', label: 'Poste', type: 'text' },
        {
          name: 'company',
          label: 'Entreprise',
          type: 'text',
          admin: { description: 'Vide : le nom du projet relié.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'logo',
          label: 'Logo du client',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Carré, SVG ou PNG. Vide : les initiales sur fond coloré.' },
        },
        {
          name: 'photo',
          label: 'Photo de la personne',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Affichée sur la page du projet.' },
        },
      ],
    },
    {
      name: 'visual',
      label: 'Image sur la carte',
      type: 'radio',
      defaultValue: 'none',
      options: [
        { label: 'Aucune', value: 'none' },
        { label: 'Image du projet relié', value: 'project' },
        { label: 'Une autre image', value: 'custom' },
      ],
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, siblingData) => siblingData?.visual === 'custom' },
    },
    {
      name: 'categories',
      label: 'Catégories (filtres)',
      type: 'relationship',
      relationTo: 'project-categories',
      hasMany: true,
      admin: { description: 'Vide : celles du projet relié.' },
    },
    {
      name: 'sector',
      label: 'Secteur (filtres)',
      type: 'text',
      admin: { description: 'Vide : celui du projet relié. Ex. Santé, Culture' },
    },
  ],
}
