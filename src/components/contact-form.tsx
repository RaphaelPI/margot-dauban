'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { type ContactState, sendContact } from '@/app/(frontend)/contact/actions'
import { Button } from '@/components/ui/button'

type Texts = {
  title?: string | null
  messagePlaceholder?: string | null
  note?: string | null
  buttonLabel?: string | null
  successTitle?: string | null
  successText?: string | null
}

const field =
  'min-h-12 w-full rounded-xl border border-[#d9dae4] bg-card px-4 py-3 text-base transition-[border-color,box-shadow] placeholder:text-[#76768a] focus:border-primary focus:shadow-[0_0_0_4px_rgb(79_70_229/0.15)] focus:outline-none aria-invalid:border-destructive motion-reduce:transition-none'
const labelClass = 'flex flex-col gap-2 text-base font-semibold'
const errorClass = 'text-base font-normal text-destructive'

// Contact form: « Envoyer un autre message » starts a fresh form (new key = empty state).
export function ContactForm({ texts }: { texts: Texts }) {
  const [round, setRound] = useState(0)
  return <Form key={round} texts={texts} onReset={() => setRound((n) => n + 1)} />
}

function Form({ texts, onReset }: { texts: Texts; onReset: () => void }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: 'idle' })
  const thanks = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (state.status === 'sent') thanks.current?.focus()
  }, [state.status])

  if (state.status === 'sent') {
    return (
      <div
        role="status"
        className="flex animate-in flex-col items-start gap-3.5 py-3 fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none"
      >
        <span
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-full bg-[#e7e6ff] text-[1.625rem] font-bold text-primary"
        >
          ✓
        </span>
        <h2 ref={thanks} tabIndex={-1} className="font-heading text-[1.375rem] font-semibold outline-none">
          {texts.successTitle || 'Merci, c’est bien reçu !'}
        </h2>
        {texts.successText ? (
          <p className="text-base leading-relaxed text-foreground-soft">{texts.successText}</p>
        ) : null}
        <button
          type="button"
          onClick={onReset}
          className="font-bold text-primary-strong underline underline-offset-4 hover:text-primary"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  const errors = state.errors ?? {}
  const values = state.values ?? {}
  const describe = (key: keyof typeof errors) =>
    errors[key] ? { 'aria-invalid': true, 'aria-describedby': `erreur-${key}` } : {}

  return (
    <form action={action} className="flex flex-col gap-5.5">
      <h2 className="font-heading text-[1.375rem] font-semibold">{texts.title || 'Votre demande'}</h2>
      <label className={labelClass}>
        Nom
        <input
          name="name"
          type="text"
          autoComplete="name"
          maxLength={120}
          defaultValue={values.name}
          placeholder="Camille Dupont"
          className={field}
          {...describe('name')}
        />
        {errors.name ? (
          <span id="erreur-name" className={errorClass}>
            {errors.name}
          </span>
        ) : null}
      </label>
      <label className={labelClass}>
        <span>
          E-mail{' '}
          <span aria-hidden="true" className="text-primary">
            *
          </span>
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={values.email}
          placeholder="camille.dupont@entreprise.fr"
          className={field}
          {...describe('email')}
        />
        {errors.email ? (
          <span id="erreur-email" className={errorClass}>
            {errors.email}
          </span>
        ) : null}
      </label>
      <label className={labelClass}>
        Téléphone
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={40}
          defaultValue={values.phone}
          placeholder="06 12 34 56 78"
          className={field}
          {...describe('phone')}
        />
        {errors.phone ? (
          <span id="erreur-phone" className={errorClass}>
            {errors.phone}
          </span>
        ) : null}
      </label>
      <label className={labelClass}>
        <span>
          Message{' '}
          <span aria-hidden="true" className="text-primary">
            *
          </span>
        </span>
        <textarea
          name="message"
          rows={6}
          required
          maxLength={5000}
          defaultValue={values.message}
          placeholder={texts.messagePlaceholder ?? undefined}
          className={`${field} resize-y`}
          {...describe('message')}
        />
        {errors.message ? (
          <span id="erreur-message" className={errorClass}>
            {errors.message}
          </span>
        ) : null}
      </label>
      {/* Hidden from people (and screen readers): only bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Site web
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="text-base leading-normal text-foreground-soft">
        <span aria-hidden="true" className="text-primary">
          *
        </span>{' '}
        Champ obligatoire.{texts.note ? ` ${texts.note}` : ''}
      </p>
      {errors.form ? (
        <p role="alert" className={errorClass}>
          {errors.form}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={pending}
        className="h-auto min-h-12 self-start rounded-full px-6.5 py-4 text-base font-bold"
      >
        {pending ? 'Envoi…' : `${texts.buttonLabel || 'Envoyer ma demande'} →`}
      </Button>
    </form>
  )
}
