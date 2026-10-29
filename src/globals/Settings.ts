import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'
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
              label: 'Texte',
              type: 'text',
              defaultValue: 'Margot Dauban — Webdesigner UI / UX freelance à Toulouse',
            },
            { name: 'footerNav', label: 'Liens', type: 'array', fields: linkFields },
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
      ],
    },
  ],
}
