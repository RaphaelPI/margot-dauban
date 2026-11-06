import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'
import { lightText, richTextFrom } from '@/fields/light-editor'
import { linkFields } from '@/fields/seo'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Réglages du site',
  access: { read: () => true, update: loggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identité',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'siteName',
                  label: 'Nom',
                  type: 'text',
                  required: true,
                  defaultValue: 'Margot Dauban',
                },
                { name: 'jobTitle', label: 'Métier', type: 'text', defaultValue: 'Webdesigner UI / UX' },
              ],
            },
            { name: 'photo', label: 'Photo', type: 'upload', relationTo: 'media' },
            {
              name: 'favicon',
              label: 'Favicon',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'image' } },
              admin: {
                description:
                  'Petite icône dans l’onglet du navigateur. Image carrée, PNG ou SVG, au moins 512 × 512 px.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'available',
                  label: 'Disponible pour de nouveaux projets',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'availabilityLabel',
                  label: 'Libellé disponibilité',
                  type: 'text',
                  defaultValue: 'Disponible',
                },
              ],
            },
            {
              name: 'email',
              label: 'Email de contact',
              type: 'email',
              defaultValue: 'hello@margotdauban.fr',
            },
          ],
        },
        {
          label: 'Navigation',
          fields: [
            { name: 'headerNav', label: 'Menu', type: 'array', fields: linkFields },
            {
              name: 'mobileNavLinks',
              label: 'Liens du menu mobile',
              labels: { singular: 'Lien', plural: 'Liens' },
              type: 'array',
              fields: linkFields,
              admin: { description: 'Petits liens en bas du menu sur téléphone (ex. Malt, LinkedIn, FAQ).' },
              defaultValue: [{ label: 'FAQ', href: '/faq' }],
            },
            {
              name: 'headerCta',
              label: 'Bouton du menu',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: 'Libellé', type: 'text', defaultValue: 'Me contacter' },
                    { name: 'href', label: 'Lien', type: 'text', defaultValue: '/contact' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Pied de page',
          fields: [
            {
              name: 'footerText',
              label: 'Phrase d’accroche',
              type: 'text',
              defaultValue: 'UI / UX Designer Freelance basée à Toulouse.',
              admin: { description: 'Sous ton nom, dans la première colonne.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'footerNavTitle',
                  label: 'Titre colonne 2',
                  type: 'text',
                  defaultValue: 'Me trouver',
                },
                { name: 'footerLegalTitle', label: 'Titre colonne 3', type: 'text', defaultValue: 'Légal' },
              ],
            },
            {
              name: 'footerNav',
              label: 'Liens colonne 2',
              labels: { singular: 'Lien', plural: 'Liens' },
              type: 'array',
              fields: linkFields,
              admin: { description: 'Ex. Contact, FAQ, Profil Malt.' },
            },
            {
              name: 'footerLegal',
              label: 'Liens colonne 3',
              labels: { singular: 'Lien', plural: 'Liens' },
              type: 'array',
              fields: linkFields,
              admin: {
                description:
                  'Ex. Mentions légales, Politique de confidentialité. « Gérer les cookies » s’ajoute tout seul quand Google Analytics est réglé.',
              },
            },
            {
              name: 'footerCta',
              label: 'Colonne 4 (bouton)',
              type: 'group',
              admin: {
                description:
                  'Affichée seulement sur les pages sans bloc indigo de fin de page (Contact, pages de texte…).',
              },
              fields: [
                { name: 'title', label: 'Titre', type: 'text', defaultValue: 'Un projet en tête ?' },
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: 'Bouton', type: 'text', defaultValue: 'Démarrons votre projet' },
                    { name: 'href', label: 'Lien du bouton', type: 'text', defaultValue: '/contact' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'footerCopyright',
                  label: 'Mention ©',
                  type: 'text',
                  defaultValue: '© 2026 Margot Dauban',
                },
                {
                  name: 'footerTopLabel',
                  label: 'Lien retour en haut',
                  type: 'text',
                  defaultValue: 'Retour en haut',
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              label: 'SEO par défaut',
              type: 'group',
              fields: [
                { name: 'title', label: 'Titre', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea', maxLength: 160 },
                { name: 'image', label: 'Image de partage', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Cookies',
          description:
            'Google Analytics ne se charge qu’après l’accord du visiteur, via le bandeau. Sans identifiant, ni bandeau ni statistiques.',
          fields: [
            {
              name: 'gaId',
              label: 'Identifiant Google Analytics',
              type: 'text',
              admin: {
                description:
                  'Commence par « G- », ex. G-AB12CD34EF (Google Analytics › Administration › Flux de données).',
              },
              validate: (value: string | null | undefined) =>
                !value ||
                /^G-[A-Z0-9]{4,}$/.test(value.trim()) ||
                'Format attendu : G- suivi de lettres et chiffres.',
            },
            {
              name: 'cookieBanner',
              label: 'Bandeau',
              type: 'group',
              fields: [
                { name: 'title', label: 'Titre', type: 'text', defaultValue: 'Un petit cookie ?' },
                {
                  name: 'text',
                  label: 'Texte',
                  ...lightText,
                  defaultValue: richTextFrom(
                    'J’utilise Google Analytics pour savoir quelles pages vous intéressent. Ces cookies ne sont déposés qu’avec votre accord.',
                  ),
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'refuseLabel', label: 'Bouton refuser', type: 'text', defaultValue: 'Refuser' },
                    { name: 'acceptLabel', label: 'Bouton accepter', type: 'text', defaultValue: 'Accepter' },
                    {
                      name: 'manageLabel',
                      label: 'Lien du pied de page',
                      type: 'text',
                      defaultValue: 'Gérer les cookies',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
