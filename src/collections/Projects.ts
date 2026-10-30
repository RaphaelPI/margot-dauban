import { type CollectionConfig, slugField } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '@/access'
import { lightText, richTextFrom } from '@/fields/light-editor'
import { seoField } from '@/fields/seo'
import { validateHref } from '@/lib/safe-href'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Projet', plural: 'Projets' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'kind', 'sector', 'year', 'featured', '_status'] },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  versions: { drafts: true },
  defaultSort: '-year',
  fields: [
    { name: 'title', label: 'Titre (nom du client)', type: 'text', required: true },
    slugField({ useAsSlug: 'title' }),
    { name: 'year', label: 'Année', type: 'number', min: 2000, max: 2100, admin: { position: 'sidebar' } },
    {
      name: 'featured',
      label: "Mis en avant sur l'accueil",
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Carte',
          description: 'Ce qui apparaît dans les listes de projets.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'kind',
                  label: 'Type de projet',
                  type: 'text',
                  required: true,
                  admin: { description: 'Ex. Site vitrine, Web app, E-commerce' },
                },
                {
                  name: 'sector',
                  label: 'Secteur',
                  type: 'text',
                  admin: { description: 'Ex. Événementiel, Santé' },
                },
              ],
            },
            {
              name: 'summary',
              label: 'Accroche',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Une phrase sur le résultat. Ex. « Moins de rebond, plus de billets vendus. »',
              },
            },
            {
              name: 'cover',
              label: 'Image de la carte',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        {
          label: 'Étude de cas',
          description:
            'La page projet en deux parties : un résumé (lu en un coup d’œil), puis la démarche détaillée. Une section laissée vide n’apparaît pas.',
          fields: [
            {
              type: 'collapsible',
              label: 'Partie 1 — Résumé',
              fields: [
                {
                  name: 'headline',
                  label: 'Accroche sous le titre',
                  type: 'group',
                  admin: { description: 'Vide : l’accroche de la carte est utilisée.' },
                  fields: [
                    {
                      name: 'highlight',
                      label: 'Début en couleur',
                      type: 'text',
                      admin: { description: 'Ex. « +10 % de chiffre d’affaires »' },
                    },
                    {
                      name: 'text',
                      label: 'Suite de la phrase',
                      type: 'textarea',
                      admin: {
                        description: 'Ex. « grâce à une expérience d’achat repensée… »',
                      },
                    },
                  ],
                },
                {
                  name: 'hero',
                  label: 'Image principale',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: "Sinon, l'image de la carte." },
                },
                {
                  name: 'overviewTitle',
                  label: 'Titre « La prestation en bref »',
                  type: 'text',
                  defaultValue: 'La prestation en bref',
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'challenge', label: 'Le problème', ...lightText },
                    { name: 'role', label: 'Mon rôle', ...lightText },
                    { name: 'response', label: 'La solution', ...lightText },
                  ],
                },
                {
                  name: 'interventions',
                  label: 'Prestations',
                  type: 'text',
                  hasMany: true,
                  admin: { description: 'Ex. Audit UI / UX, Wireframes, Design System' },
                },
                {
                  name: 'resultsTitle',
                  label: 'Titre des résultats',
                  type: 'text',
                  defaultValue: 'Les résultats',
                  admin: { description: 'Ex. « Les résultats, 12 mois après »' },
                },
                {
                  name: 'metrics',
                  label: 'Chiffres clés',
                  labels: { singular: 'Chiffre', plural: 'Chiffres' },
                  type: 'array',
                  maxRows: 4,
                  admin: { description: 'Le premier est mis en avant sur fond indigo.' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'value',
                          label: 'Valeur',
                          type: 'text',
                          required: true,
                          admin: { description: 'Ex. +10 %, 13 → 10, Moins d’appels' },
                        },
                        { name: 'label', label: 'Libellé', type: 'text', required: true },
                      ],
                    },
                  ],
                },
                { name: 'results', label: 'Texte sous les chiffres', type: 'richText' },
                {
                  name: 'galleryTitle',
                  label: 'Titre des captures',
                  type: 'text',
                  defaultValue: 'Le résultat en images',
                },
                {
                  name: 'gallery',
                  label: 'Captures',
                  type: 'upload',
                  relationTo: 'media',
                  hasMany: true,
                  admin: { description: 'Affichées deux par ligne.' },
                },
                {
                  name: 'stepsTitle',
                  label: 'Titre des étapes en bref',
                  type: 'text',
                  defaultValue: 'En bref : comment on y est arrivés',
                },
                {
                  name: 'objectives',
                  label: 'Texte à côté des étapes',
                  ...lightText,
                  admin: { description: 'Ex. « Objectifs : vendre plus en simplifiant le catalogue… »' },
                },
                {
                  name: 'website',
                  label: 'Site en ligne',
                  type: 'group',
                  admin: { description: 'Lien affiché à droite du titre des résultats.' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'url', label: 'URL', type: 'text', validate: validateHref },
                        {
                          name: 'label',
                          label: 'Libellé du lien',
                          type: 'text',
                          defaultValue: 'Voir le site',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Partie 2 — Démarche détaillée',
              fields: [
                {
                  name: 'approachTitle',
                  label: 'Titre de la démarche',
                  type: 'text',
                  defaultValue: 'La démarche en détail',
                },
                {
                  name: 'contextTitle',
                  label: 'Titre du contexte',
                  type: 'text',
                  defaultValue: 'Contexte & enjeux',
                },
                { name: 'context', label: 'Contexte & enjeux', type: 'richText' },
                {
                  name: 'goalsTitle',
                  label: 'Titre des objectifs',
                  type: 'text',
                  defaultValue: 'Objectifs',
                },
                {
                  name: 'goals',
                  label: 'Objectifs',
                  labels: { singular: 'Objectif', plural: 'Objectifs' },
                  type: 'array',
                  admin: { description: 'Une carte par objectif, sous « Contexte & enjeux ».' },
                  fields: [
                    {
                      name: 'icon',
                      label: 'Picto',
                      type: 'text',
                      admin: {
                        description:
                          'Nom d’une icône de phosphoricons.com : clique sur l’icône et copie son nom (ex. target, arrow-up-right).',
                      },
                    },
                    {
                      name: 'title',
                      label: 'Titre court',
                      type: 'text',
                      required: true,
                      admin: { description: 'Ex. Diminuer le taux de rebond' },
                    },
                    { name: 'text', label: 'Texte', ...lightText },
                  ],
                },
                {
                  name: 'constraintsTitle',
                  label: 'Titre des contraintes',
                  type: 'text',
                  defaultValue: 'Contraintes',
                },
                {
                  name: 'constraintCards',
                  label: 'Contraintes',
                  labels: { singular: 'Contrainte', plural: 'Contraintes' },
                  type: 'array',
                  admin: { description: 'Une carte par contrainte, sous les objectifs.' },
                  fields: [
                    {
                      name: 'icon',
                      label: 'Picto',
                      type: 'text',
                      admin: {
                        description:
                          'Nom d’une icône de phosphoricons.com : clique sur l’icône et copie son nom (ex. target, arrow-up-right).',
                      },
                    },
                    {
                      name: 'title',
                      label: 'Titre court',
                      type: 'text',
                      required: true,
                      admin: { description: 'Ex. Billetterie externe imposée' },
                    },
                    { name: 'text', label: 'Texte', ...lightText },
                  ],
                },
                {
                  name: 'constraints',
                  label: 'Contraintes (ancien modèle)',
                  type: 'richText',
                  admin: {
                    description:
                      'Plus affiché sur la page : à reprendre dans les cartes « Contraintes » ci-dessus.',
                  },
                },
                {
                  name: 'approach',
                  label: 'Étapes',
                  labels: { singular: 'Étape', plural: 'Étapes' },
                  type: 'array',
                  admin: {
                    description:
                      'Chaque étape apparaît deux fois : en bref (partie 1) et en détail (partie 2).',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'shortTitle',
                          label: 'Titre court (en bref et sommaire)',
                          type: 'text',
                          admin: { description: 'Vide : le titre détaillé.' },
                        },
                        { name: 'title', label: 'Titre détaillé', type: 'text', required: true },
                      ],
                    },
                    {
                      name: 'summary',
                      label: 'Résumé en une phrase (en bref)',
                      ...lightText,
                    },
                    { name: 'content', label: 'Texte détaillé', type: 'richText' },
                    { name: 'images', label: 'Captures', type: 'upload', relationTo: 'media', hasMany: true },
                  ],
                },
              ],
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
                  defaultValue: 'Un projet similaire ?',
                  admin: { description: 'Ex. « Un projet e-commerce à refondre ? »' },
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
                    {
                      name: 'buttonLabel',
                      label: 'Libellé du bouton',
                      type: 'text',
                      defaultValue: 'Me contacter',
                    },
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
            {
              name: 'lead',
              label: 'Introduction (ancien modèle)',
              type: 'richText',
              admin: {
                description: 'Plus affichée sur la page : à reprendre dans « Accroche » ou « Le défi ».',
              },
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}
