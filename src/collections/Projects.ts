import { type CollectionConfig, slugField } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '@/access'
import { seoField } from '@/fields/seo'

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
          fields: [
            { name: 'lead', label: 'Introduction (le client en une phrase)', type: 'richText' },
            {
              name: 'interventions',
              label: 'Interventions',
              type: 'text',
              hasMany: true,
              admin: { description: 'Ex. Audit UI / UX, Wireframes, Design System' },
            },
            {
              name: 'hero',
              label: 'Image principale',
              type: 'upload',
              relationTo: 'media',
              admin: { description: "Sinon, l'image de la carte." },
            },
            { name: 'context', label: 'Contexte & objectifs', type: 'richText' },
            { name: 'constraints', label: 'Contraintes', type: 'richText' },
            {
              name: 'approachTitle',
              label: 'Titre de la démarche',
              type: 'text',
              defaultValue: 'Démarche et solutions',
            },
            {
              name: 'approach',
              label: 'Étapes de la démarche',
              labels: { singular: 'Étape', plural: 'Étapes' },
              type: 'array',
              fields: [
                { name: 'title', label: 'Titre', type: 'text', required: true },
                { name: 'content', label: 'Texte', type: 'richText' },
                { name: 'images', label: 'Images', type: 'upload', relationTo: 'media', hasMany: true },
              ],
            },
            { name: 'resultsTitle', label: 'Titre des résultats', type: 'text', defaultValue: 'Résultats' },
            {
              name: 'metrics',
              label: 'Chiffres clés',
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
                      admin: { description: 'Ex. −25 %' },
                    },
                    { name: 'label', label: 'Libellé', type: 'text', required: true },
                  ],
                },
              ],
            },
            { name: 'results', label: 'Résultats', type: 'richText' },
            {
              name: 'website',
              label: 'Site en ligne',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'url', label: 'URL', type: 'text' },
                    { name: 'label', label: 'Libellé du bouton', type: 'text', defaultValue: 'Voir le site' },
                  ],
                },
              ],
            },
            { name: 'gallery', label: 'Galerie de fin', type: 'upload', relationTo: 'media', hasMany: true },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}
