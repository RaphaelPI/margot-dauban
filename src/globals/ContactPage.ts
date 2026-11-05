import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'
import { seoField } from '@/fields/seo'
import { validateHref } from '@/lib/safe-href'

// Page « Contact » (/contact, designs/31-page-contact). Messages sent from the form are stored
// in « Messages » (contact-messages).
export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Page Contact',
  admin: { description: 'Textes de la page Contact (/contact). Les messages reçus sont dans « Messages ».' },
  access: { read: () => true, update: loggedIn },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', label: 'Titre', type: 'text', required: true, defaultValue: 'Parlons de votre' },
        {
          name: 'highlight',
          label: 'Fin du titre surlignée',
          type: 'text',
          defaultValue: 'projet web',
        },
      ],
    },
    {
      name: 'intro',
      label: 'Introduction',
      type: 'textarea',
      defaultValue:
        'Refonte de site, application métier, SaaS ou e-commerce : décrivez votre besoin, je vous réponds sous 48 h ouvrées. Webdesigner UI / UX freelance basée à Toulouse.',
    },
    {
      name: 'cards',
      label: 'Cartes de coordonnées',
      labels: { singular: 'Carte', plural: 'Cartes' },
      type: 'array',
      maxRows: 6,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', label: 'Petit libellé', type: 'text', admin: { description: 'Ex. « E-mail »' } },
            { name: 'value', label: 'Texte en gras', type: 'text', required: true },
          ],
        },
        {
          name: 'href',
          label: 'Lien',
          type: 'text',
          validate: validateHref,
          admin: {
            description: 'Facultatif. mailto:… pour un e-mail, https://… pour un profil (nouvel onglet).',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              label: 'Icône',
              type: 'text',
              admin: {
                description: 'Nom d’une icône Phosphor (phosphoricons.com), ex. « envelope-simple ».',
              },
            },
            {
              name: 'monogram',
              label: 'Ou lettres',
              type: 'text',
              maxLength: 3,
              admin: { description: 'À la place de l’icône, ex. « M » pour Malt, « in » pour LinkedIn.' },
            },
            {
              name: 'tone',
              label: 'Couleur',
              type: 'select',
              defaultValue: 'indigo',
              options: [
                { label: 'Indigo', value: 'indigo' },
                { label: 'Pêche', value: 'peach' },
                { label: 'Bleu', value: 'blue' },
              ],
            },
          ],
        },
      ],
      defaultValue: [
        {
          label: 'E-mail',
          value: 'hello@margotdauban.fr',
          href: 'mailto:hello@margotdauban.fr',
          icon: 'envelope-simple',
          tone: 'indigo',
        },
        {
          label: 'Basée à Toulouse',
          value: 'Missions sur place ou à distance',
          icon: 'map-pin',
          tone: 'peach',
        },
        { label: 'Malt', value: 'Profil Malt →', monogram: 'M', tone: 'blue' },
        { label: 'LinkedIn', value: 'Profil LinkedIn →', monogram: 'in', tone: 'indigo' },
      ],
    },
    {
      name: 'form',
      label: 'Formulaire',
      type: 'group',
      fields: [
        { name: 'title', label: 'Titre', type: 'text', defaultValue: 'Votre demande' },
        {
          name: 'messagePlaceholder',
          label: 'Exemple dans le champ Message',
          type: 'text',
          defaultValue: 'Votre projet en quelques lignes : contexte, objectifs, échéance…',
        },
        {
          name: 'note',
          label: 'Phrase sous le formulaire',
          type: 'textarea',
          defaultValue: 'Votre message m’arrive par e-mail. Il sert uniquement à vous répondre.',
        },
        { name: 'buttonLabel', label: 'Libellé du bouton', type: 'text', defaultValue: 'Envoyer ma demande' },
        {
          name: 'successTitle',
          label: 'Titre après envoi',
          type: 'text',
          defaultValue: 'Merci, c’est bien reçu !',
        },
        {
          name: 'successText',
          label: 'Texte après envoi',
          type: 'textarea',
          defaultValue:
            'Je reviens vers vous sous 48 h ouvrées, en général avec quelques questions pour préparer notre premier échange.',
        },
      ],
    },
    seoField,
  ],
}
