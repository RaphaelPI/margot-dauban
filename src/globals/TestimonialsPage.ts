import type { GlobalConfig } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '@/access'
import { lightText, richTextFrom } from '@/fields/light-editor'
import { withSeoTab } from '@/fields/seo'
import { titleFrom, titleText } from '@/fields/title-text'
import { globalPreviewPaths, previewUrl } from '@/lib/preview-url'

export const TestimonialsPage: GlobalConfig = {
  slug: 'testimonials-page',
  label: 'Page Témoignages',
  admin: {
    preview: () => previewUrl(globalPreviewPaths['testimonials-page']),
    description: 'Textes de la page Témoignages (/temoignages). Les avis se gèrent dans « Témoignages ».',
  },
  // Drafts: « Enregistrer le brouillon » changes nothing online until « Publier »; « Aperçu » shows it.
  access: { read: publishedOrLoggedIn, update: loggedIn },
  versions: { drafts: true },
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
