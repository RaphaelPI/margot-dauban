import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'
import { titleFrom, titleText } from '@/fields/title-text'
import { validateHref } from '@/lib/safe-href'

// Page « 404 » shown for any unknown address (designs/76-page-404): a failed user test.
export const NotFoundPage: GlobalConfig = {
  slug: 'not-found-page',
  label: 'Page 404',
  admin: {
    description: 'Textes de la page affichée quand une adresse n’existe pas (lien cassé, page supprimée).',
  },
  access: { read: () => true, update: loggedIn },
  fields: [
    {
      name: 'badge',
      label: 'Pastille',
      type: 'text',
      defaultValue: 'Rapport de test · erreur 404',
    },
    {
      name: 'title',
      label: 'Titre',
      ...titleText(),
      required: true,
      defaultValue: titleFrom('Résultat du test : cette page n’existe pas.'),
      admin: { description: 'Le texte en gras s’affiche surligné en lilas.' },
    },
    {
      name: 'text',
      label: 'Texte',
      type: 'textarea',
      defaultValue:
        'Bonne nouvelle : repérer ce qui bloque les utilisateurs, c’est précisément mon métier. Mauvaise nouvelle : ici, c’est moi qui suis prise en défaut.',
    },
    {
      type: 'row',
      fields: [
        { name: 'homeLabel', label: 'Bouton principal', type: 'text', defaultValue: 'Retour à l’accueil' },
        { name: 'linkLabel', label: 'Lien secondaire', type: 'text', defaultValue: 'Me contacter' },
        {
          name: 'linkHref',
          label: 'Adresse du lien secondaire',
          type: 'text',
          defaultValue: '/contact',
          validate: validateHref,
        },
      ],
    },
    {
      name: 'report',
      label: 'Illustration (rapport de test)',
      type: 'group',
      admin: { description: 'Textes de l’illustration à droite.' },
      fields: [
        {
          name: 'stats',
          label: 'Indicateurs',
          labels: { singular: 'Indicateur', plural: 'Indicateurs' },
          type: 'array',
          maxRows: 3,
          admin: { description: 'Le premier chiffre s’affiche en rouge, le deuxième tremble.' },
          defaultValue: [
            { label: 'Taux de réussite', value: '0 %' },
            { label: 'Clics de frustration', value: '404' },
            { label: 'Temps perdu', value: '3 s' },
          ],
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', label: 'Libellé', type: 'text', required: true },
                { name: 'value', label: 'Chiffre', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          name: 'diagnosis',
          label: 'Diagnostic',
          type: 'text',
          defaultValue: 'lien cassé ou page déplacée',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'recommendation',
              label: 'Recommandation',
              type: 'text',
              defaultValue: 'revenir à l’accueil',
            },
            { name: 'severity', label: 'Sévérité (en rouge)', type: 'text', defaultValue: 'critique' },
          ],
        },
      ],
    },
  ],
}
