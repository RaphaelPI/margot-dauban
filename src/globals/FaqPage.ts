import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'
import { lightText, richTextFrom } from '@/fields/light-editor'
import { withSeoTab } from '@/fields/seo'
import { validateHref } from '@/lib/safe-href'

export const FaqPage: GlobalConfig = {
  slug: 'faq-page',
  label: 'Page FAQ',
  admin: { description: 'Textes de la page FAQ (/faq). Les questions se gèrent dans « FAQ ».' },
  access: { read: () => true, update: loggedIn },
  fields: [
    ...withSeoTab([
      { name: 'eyebrow', label: 'Surtitre', type: 'text', defaultValue: 'FAQ' },
      {
        name: 'title',
        label: 'Titre',
        type: 'text',
        required: true,
        defaultValue: 'Tarifs, délais & méthode',
        admin: { description: 'Un « & » dans le titre s’affiche en indigo.' },
      },
      {
        name: 'intro',
        label: 'Introduction',
        type: 'textarea',
        defaultValue:
          'Webdesigner UI / UX freelance à Toulouse : tout ce qu’il faut savoir avant de lancer votre projet.',
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
            defaultValue: 'Vous ne trouvez pas votre réponse ?',
          },
          {
            name: 'text',
            label: 'Texte',
            ...lightText,
            defaultValue: richTextFrom('Posez-moi directement votre question : réponse sous 24 à 48 h.'),
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
