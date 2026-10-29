import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Réglages du site',
  access: { read: () => true, update: loggedIn },
  fields: [
    { name: 'siteName', label: 'Nom du site', type: 'text', required: true, defaultValue: 'Margot Dauban' },
    { name: 'tagline', label: 'Accroche', type: 'text', defaultValue: 'Designer UI/UX freelance' },
    { name: 'intro', label: "Texte d'introduction", type: 'textarea' },
    { name: 'email', label: 'Email de contact', type: 'email' },
    {
      name: 'links',
      label: 'Liens',
      type: 'array',
      fields: [
        { name: 'label', label: 'Libellé', type: 'text', required: true },
        { name: 'url', label: 'URL', type: 'text', required: true },
      ],
    },
  ],
}
