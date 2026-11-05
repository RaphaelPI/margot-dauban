import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'
import { lightText, richTextFrom } from '@/fields/light-editor'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Accueil',
  access: { read: () => true, update: loggedIn },
  fields: [
    {
      name: 'hero',
      label: 'En-tête',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Titre',
          type: 'text',
          required: true,
          defaultValue: 'Webdesigner UI / UX freelance',
        },
        { name: 'highlight', label: 'Fin du titre en accent', type: 'text', defaultValue: 'à Toulouse' },
        { name: 'intro', label: 'Introduction', type: 'textarea' },
        {
          type: 'row',
          fields: [
            { name: 'ctaLabel', label: 'Bouton', type: 'text', defaultValue: 'Voir mes projets' },
            { name: 'ctaHref', label: 'Lien du bouton', type: 'text', defaultValue: '#projets' },
          ],
        },
      ],
    },
    {
      name: 'stats',
      label: 'Chiffres',
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
              admin: { description: 'Ex. 60+' },
            },
            { name: 'label', label: 'Libellé', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'projects',
      label: 'Projets',
      type: 'group',
      fields: [
        { name: 'title', label: 'Titre', type: 'text', defaultValue: 'Projets UI / UX récents' },
        {
          name: 'linkLabel',
          label: 'Lien vers tous les projets',
          type: 'text',
          defaultValue: 'Voir tous les projets',
        },
        {
          name: 'items',
          label: 'Projets affichés',
          type: 'relationship',
          relationTo: 'projects',
          hasMany: true,
          admin: { description: 'Vide = les projets « mis en avant », du plus récent au plus ancien.' },
        },
      ],
    },
    {
      name: 'about',
      label: 'À propos',
      type: 'group',
      admin: {
        description:
          'Section après les projets : une image d’un côté, le texte de l’autre. Masquée sans titre.',
      },
      fields: [
        { name: 'eyebrow', label: 'Étiquette', type: 'text', defaultValue: 'Bonjour, moi c’est Margot' },
        {
          type: 'row',
          fields: [
            { name: 'title', label: 'Titre', type: 'text', defaultValue: 'UI / UX Designer freelance' },
            {
              name: 'highlight',
              label: 'Fin du titre surlignée',
              type: 'text',
              defaultValue: 'basée à Toulouse',
            },
          ],
        },
        {
          name: 'lead',
          label: 'Accroche (en gras)',
          ...lightText,
          defaultValue: richTextFrom(
            'UI/UX et product designer freelance à Toulouse, je conçois des interfaces pour des applications métier, des plateformes SaaS et des sites web.',
          ),
        },
        { name: 'body', label: 'Paragraphes', ...lightText },
        { name: 'callout', label: 'Phrase sous le trait', ...lightText },
        {
          type: 'row',
          fields: [
            { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
            {
              name: 'imagePosition',
              label: 'Position de l’image',
              type: 'radio',
              defaultValue: 'left',
              options: [
                { label: 'À gauche', value: 'left' },
                { label: 'À droite', value: 'right' },
              ],
              admin: { description: 'Sur téléphone, l’image passe toujours sous le texte.' },
            },
          ],
        },
      ],
    },
    {
      name: 'testimonial',
      label: 'Témoignage',
      type: 'group',
      admin: { description: 'Bloc sombre après les projets. Vide = bloc masqué.' },
      fields: [
        {
          name: 'quote',
          label: 'Citation',
          type: 'textarea',
          admin: { description: 'Sans guillemets : ils sont ajoutés automatiquement.' },
        },
        {
          name: 'highlight',
          label: 'Fin de la citation en accent',
          type: 'text',
          admin: { description: 'Ex. la phrase qui parle du résultat. Affichée en lilas après la citation.' },
        },
        {
          type: 'row',
          fields: [
            { name: 'author', label: 'Prénom Nom', type: 'text' },
            { name: 'role', label: 'Poste', type: 'text' },
            { name: 'company', label: 'Entreprise', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'expertise',
      label: 'Expertises',
      type: 'group',
      fields: [
        { name: 'title', label: 'Titre', type: 'text', defaultValue: 'Expertises UX, UI & branding' },
        {
          name: 'linkLabel',
          label: 'Lien vers les services',
          type: 'text',
          defaultValue: 'Découvrir mes services',
        },
      ],
    },
    {
      name: 'cta',
      label: 'Appel à l’action',
      type: 'group',
      fields: [
        { name: 'title', label: 'Titre', type: 'text', defaultValue: 'Un projet web ? Parlons-en.' },
        { name: 'text', label: 'Texte', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'buttonLabel', label: 'Bouton', type: 'text', defaultValue: 'Me contacter' },
            { name: 'buttonHref', label: 'Lien', type: 'text', defaultValue: '/contact' },
          ],
        },
      ],
    },
  ],
}
