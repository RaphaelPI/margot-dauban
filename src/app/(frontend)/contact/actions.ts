'use server'

import { z } from 'zod'
import { getPayload } from '@/lib/payload'

// Contact form (designs/31-page-contact): validated here, stored in « Messages ». `website` is a
// field hidden from people: a bot filling it gets the thank-you and nothing is stored.

const schema = z.object({
  name: z.string().trim().max(120, 'Nom trop long (120 caractères maximum).'),
  email: z.email('Indiquez une adresse e-mail valide, par ex. camille@entreprise.fr.'),
  phone: z.string().trim().max(40, 'Numéro trop long.'),
  message: z
    .string()
    .trim()
    .min(1, 'Écrivez quelques mots sur votre projet.')
    .max(5000, 'Message trop long (5 000 caractères maximum).'),
})

export type ContactValues = z.infer<typeof schema>
export type ContactState = {
  status: 'idle' | 'error' | 'sent'
  errors?: Partial<Record<keyof ContactValues | 'form', string>>
  values?: Partial<ContactValues>
}

const text = (formData: FormData, key: string) => {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

export async function sendContact(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: text(formData, 'name'),
    email: text(formData, 'email').trim(),
    phone: text(formData, 'phone'),
    message: text(formData, 'message'),
  }
  if (text(formData, 'website')) return { status: 'sent' }

  const parsed = schema.safeParse(values)
  if (!parsed.success) {
    const errors: ContactState['errors'] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactValues
      errors[key] ??= issue.message
    }
    return { status: 'error', errors, values }
  }

  try {
    const payload = await getPayload()
    await payload.create({ collection: 'contact-messages', data: { ...parsed.data, handled: false } })
    return { status: 'sent' }
  } catch (error) {
    console.error('Contact message not saved', error)
    return {
      status: 'error',
      errors: {
        form: 'L’envoi n’a pas abouti. Réessayez dans un instant, ou écrivez-moi directement par e-mail.',
      },
      values,
    }
  }
}
