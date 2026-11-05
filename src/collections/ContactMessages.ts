import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
import { loggedIn } from '@/access'

// Notifies Margot of a new message. Sends nothing until an e-mail adapter is configured in
// payload.config.ts (separate issue): Payload then only logs the attempt. Never blocks saving.
const notify: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  try {
    const settings = await req.payload.findGlobal({ slug: 'settings', depth: 0, req })
    if (!settings.email) return doc
    await req.payload.sendEmail({
      to: settings.email,
      replyTo: doc.email,
      subject: `Nouveau message de ${doc.name || doc.email} (site)`,
      text: [
        `Nom : ${doc.name || '—'}`,
        `E-mail : ${doc.email}`,
        `Téléphone : ${doc.phone || '—'}`,
        '',
        doc.message,
      ].join('\n'),
    })
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Contact message notification failed' })
  }
  return doc
}

// Messages sent from the contact form. Created only by the site's server action (Local API);
// nobody can create, read or change them through the public API without being logged in.
export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Message', plural: 'Messages' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'handled', 'createdAt'],
    description: 'Messages envoyés depuis le formulaire de la page Contact.',
  },
  access: { create: () => false, read: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [notify] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nom', type: 'text', maxLength: 120 },
        { name: 'email', label: 'E-mail', type: 'email', required: true },
        { name: 'phone', label: 'Téléphone', type: 'text', maxLength: 40 },
      ],
    },
    { name: 'message', label: 'Message', type: 'textarea', required: true, maxLength: 5000 },
    {
      name: 'handled',
      label: 'Traité',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'À cocher une fois la réponse envoyée.' },
    },
  ],
}
