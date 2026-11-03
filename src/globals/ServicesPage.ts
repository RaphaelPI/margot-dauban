import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'
import { lightText, richTextFrom } from '@/fields/light-editor'
import { seoField } from '@/fields/seo'
import { validateHref } from '@/lib/safe-href'

const defaultSteps = [
  {
    title: 'Comprendre',
    text: 'Vos utilisateurs, leurs usages et vos objectifs.',
    screenLabel: 'atelier — vos clients en ligne',
  },
  {
    title: 'Analyser',
    text: 'L’existant, pour repérer ce qui freine.',
    screenLabel: 'audit — liste produits actuelle',
  },
  {
    title: 'Structurer',
    text: 'Les parcours, l’arborescence et les wireframes.',
    screenLabel: 'wireframes — liste › fiche › panier',
  },
  {
    title: 'Concevoir',
    text: 'Des maquettes Figma prêtes à développer, avec design system.',
    screenLabel: 'ceramia.fr — maquette finale',
  },
]

export const ServicesPage: GlobalConfig = {
  slug: 'services-page',
  label: 'Page Prestations',
  admin: {
    description:
      'Textes de la page Prestations (/prestations). Les expertises se gèrent dans « Expertises ».',
  },
  access: { read: () => true, update: loggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Présentation',
          name: 'hero',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  label: 'Titre',
                  type: 'text',
                  required: true,
                  defaultValue: 'Webdesigner freelance',
                },
                {
                  name: 'highlight',
                  label: 'Fin du titre surlignée',
                  type: 'text',
                  defaultValue: 'à Toulouse',
                },
              ],
            },
            {
              name: 'lead',
              label: 'Accroche (en gras)',
              type: 'textarea',
              defaultValue:
                'Je suis Margot Dauban, webdesigner freelance à Toulouse, spécialisée en UX et UI design.',
            },
            {
              name: 'body',
              label: 'Texte',
              ...lightText,
              defaultValue: richTextFrom(
                'J’accompagne startups, PME et éditeurs de logiciels dans la conception de sites web, d’applications métier et de SaaS : audit de l’existant, parcours utilisateurs, wireframes, maquettes Figma et design system.\nJ’interviens à Toulouse et en Haute-Garonne, partout en Occitanie, et à distance dans toute la France.',
              ),
            },
            {
              name: 'callout',
              label: 'Encadré',
              ...lightText,
              defaultValue: richTextFrom(
                'Mon objectif : rendre simples des outils complexes, en partant des usages réels de vos utilisateurs et en travaillant au plus près de vos équipes et de vos développeurs.',
              ),
            },
            { name: 'portrait', label: 'Portrait', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Expertises',
          fields: [
            {
              name: 'expertisesTitle',
              label: 'Titre des expertises',
              type: 'text',
              defaultValue: 'Mes 4 expertises',
              admin: { description: 'Les expertises elles-mêmes se gèrent dans « Expertises ».' },
            },
          ],
        },
        {
          label: 'Méthode',
          name: 'process',
          fields: [
            { name: 'eyebrow', label: 'Surtitre', type: 'text', defaultValue: 'Méthode' },
            { name: 'title', label: 'Titre', type: 'text', defaultValue: 'Comment se déroule une mission' },
            {
              name: 'intro',
              label: 'Introduction',
              type: 'textarea',
              defaultValue: 'Regardez votre interface se construire, étape par étape.',
            },
            {
              name: 'steps',
              label: 'Étapes',
              labels: { singular: 'Étape', plural: 'Étapes' },
              type: 'array',
              maxRows: 4,
              defaultValue: defaultSteps,
              admin: {
                description: 'Quatre étapes au plus : chacune a son illustration animée (dans cet ordre).',
              },
              fields: [
                { name: 'title', label: 'Titre', type: 'text', required: true },
                { name: 'text', label: 'Texte', type: 'textarea' },
                {
                  name: 'screenLabel',
                  label: 'Libellé de l’écran',
                  type: 'text',
                  admin: { description: 'Affiché dans la barre d’adresse de l’écran animé.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Équipe',
          name: 'team',
          fields: [
            { name: 'title', label: 'Titre', type: 'text', defaultValue: 'Besoin d’une équipe complète ?' },
            {
              name: 'text',
              label: 'Texte',
              ...lightText,
              defaultValue: richTextFrom(
                'Je travaille au sein des collectifs de freelances LaGuild et HappyDev. Pour une offre plus complète, je peux constituer une équipe sur mesure autour de votre projet.',
              ),
            },
            {
              name: 'labels',
              label: 'Étiquettes',
              type: 'text',
              hasMany: true,
              defaultValue: ['LaGuild', 'HappyDev'],
            },
          ],
        },
        {
          label: 'Bandeau',
          name: 'cta',
          fields: [
            { name: 'title', label: 'Titre', type: 'text', defaultValue: 'Un projet ? Parlons-en.' },
            {
              name: 'text',
              label: 'Texte',
              ...lightText,
              defaultValue: richTextFrom(
                'Audit, refonte ou nouveau produit : décrivez-moi votre besoin, je vous réponds rapidement.',
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
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}
