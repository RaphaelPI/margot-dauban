import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'
import { lightText, richTextFrom } from '@/fields/light-editor'
import { withSeoTab } from '@/fields/seo'
import { titleFrom, titleText } from '@/fields/title-text'

export const TestimonialsPage: GlobalConfig = {
  slug: 'testimonials-page',
  label: 'Page Témoignages',
  admin: {
    description: 'Textes de la page Témoignages (/temoignages). Les avis se gèrent dans « Témoignages ».',
  },
  access: { read: () => true, update: loggedIn },
  fields: [
    ...withSeoTab([
      {
        name: 'title',
        label: 'Titre',
        ...titleText(),
        required: true,
        defaultValue: titleFrom('Ils m’ont confié leur', 'projet'),
        admin: { description: 'Le texte en gras s’affiche surligné en lilas.' },
      },
      {
        name: 'intro',
        label: 'Introduction',
        ...lightText,
        defaultValue: richTextFrom(
          'Avis clients de missions UI / UX et webdesign freelance : éditeurs de logiciels, startups, PME. Filtrez par secteur ou par type de projet.',
        ),
      },
    ]),
  ],
}
