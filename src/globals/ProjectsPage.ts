import type { GlobalConfig } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '@/access'
import { lightText, richTextFrom } from '@/fields/light-editor'
import { withSeoTab } from '@/fields/seo'
import { legacyHighlight, titleFrom, titleText } from '@/fields/title-text'
import { globalPreviewPaths, previewUrl } from '@/lib/preview-url'
import { validateHref } from '@/lib/safe-href'

export const ProjectsPage: GlobalConfig = {
  slug: 'projects-page',
  label: 'Page Projets',
  admin: {
    preview: () => previewUrl(globalPreviewPaths['projects-page']),
    description: 'Textes de la page qui liste tous les projets (/projets).',
  },
  // Drafts: « Enregistrer le brouillon » changes nothing online until « Publier »; « Aperçu » shows it.
  access: { read: publishedOrLoggedIn, update: loggedIn },
  versions: { drafts: true },
  fields: [
    ...withSeoTab([
      {
        type: 'row',
        fields: [
          {
            name: 'title',
            label: 'Titre',
            ...titleText('highlight'),
            required: true,
            defaultValue: titleFrom('Projets UI / UX et webdesign', 'freelance'),
            admin: { description: 'Le texte en gras s’affiche surligné en lilas.' },
          },
          { name: 'highlight', label: 'Fin du titre surlignée (ancien)', ...legacyHighlight },
        ],
      },
      {
        name: 'intro',
        label: 'Introduction',
        ...lightText,
        defaultValue: richTextFrom(
          'SaaS, logiciels métier, sites vitrine et e-commerce : une sélection de missions menées depuis Toulouse pour des éditeurs de logiciels, startups, PME et ETI.',
        ),
      },
      {
        name: 'cta',
        label: 'Bandeau de contact (bas de page)',
        type: 'group',
        fields: [
          {
            name: 'title',
            label: 'Titre',
            type: 'text',
            defaultValue: 'Votre projet pourrait être le prochain.',
          },
          {
            name: 'text',
            label: 'Texte',
            ...lightText,
            defaultValue: richTextFrom(
              'Webdesigner freelance à Toulouse, en mission sur place ou à distance.',
            ),
          },
          {
            type: 'row',
            fields: [
              { name: 'buttonLabel', label: 'Libellé du bouton', type: 'text', defaultValue: 'Me contacter' },
              {
                name: 'buttonHref',
                label: 'Lien du bouton',
                type: 'text',
                defaultValue: '/contact',
                validate: validateHref,
              },
            ],
          },
        ],
      },
    ]),
  ],
}
