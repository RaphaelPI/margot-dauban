import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Accueil',
  access: { read: () => true, update: loggedIn },
  fields: [
    {
      name: 'hero',
      label: 'En-tête',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Titre',
          type: 'text',
          required: true,
          defaultValue: 'Webdesigner UI / UX freelance',
        },
        { name: 'highlight', label: 'Fin du titre en accent', type: 'text', defaultValue: 'à Toulouse' },
        { name: 'intro', label: 'Introduction', type: 'textarea' },
        {
          type: 'row',
          fields: [
            { name: 'ctaLabel', label: 'Bouton', type: 'text', defaultValue: 'Voir mes projets' },
            { name: 'ctaHref', label: 'Lien du bouton', type: 'text', defaultValue: '#projets' },
          ],
        },
      ],
    },
    {
      name: 'stats',
      label: 'Chiffres',
      labels: { singular: 'Chiffre', plural: 'Chiffres' },
      type: 'array',
      maxRows: 4,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              label: 'Valeur',
              type: 'text',
              required: true,
              admin: { description: 'Ex. 60+' },
            },
            { name: 'label', label: 'Libellé', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'projects',
      label: 'Projets',
      type: 'group',
      fields: [
        { name: 'title', label: 'Titre', type: 'text', defaultValue: 'Projets UI / UX récents' },
        {
          name: 'linkLabel',
          label: 'Lien vers tous les projets',
          type: 'text',
          defaultValue: 'Voir tous les projets',
        },
        {
          name: 'items',
          label: 'Projets affichés',
          type: 'relationship',
          relationTo: 'projects',
          hasMany: true,
          admin: { description: 'Vide = les projets « mis en avant », du plus récent au plus ancien.' },
        },
      ],
    },
    {
      name: 'testimonial',
      label: 'Témoignage affiché',
      type: 'relationship',
      relationTo: 'testimonials',
    },
    {
      name: 'expertise',
      label: 'Expertises',
      type: 'group',
      fields: [
        { name: 'title', label: 'Titre', type: 'text', defaultValue: 'Expertises UX, UI & branding' },
        {
          name: 'linkLabel',
          label: 'Lien vers les services',
          type: 'text',
          defaultValue: 'Découvrir mes services',
        },
      ],
    },
    {
      name: 'cta',
      label: 'Appel à l’action',
      type: 'group',
      fields: [
        { name: 'title', label: 'Titre', type: 'text', defaultValue: 'Un projet web ? Parlons-en.' },
        { name: 'text', label: 'Texte', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'buttonLabel', label: 'Bouton', type: 'text', defaultValue: 'Me contacter' },
            { name: 'buttonHref', label: 'Lien', type: 'text', defaultValue: '/contact' },
          ],
        },
      ],
    },
  ],
}
