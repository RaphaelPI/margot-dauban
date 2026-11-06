'use client'

import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { type Consent, clearAnalyticsCookies, readConsent, saveConsent } from '@/lib/consent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    [key: `ga-disable-${string}`]: boolean | undefined
  }
}

const openEvent = 'cookie-consent:open'

// Loads Google Analytics (gtag.js) once, only after the visitor accepted.
function loadAnalytics(gaId: string) {
  window[`ga-disable-${gaId}`] = false
  if (window.gtag) return
  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag() {
    // biome-ignore lint/complexity/noArguments: gtag expects the arguments object itself
    window.dataLayer?.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', gaId)
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`
  document.head.appendChild(script)
}

// Cookie banner: small card bottom right, compact text (14px, designer's explicit exception). Nothing from Google loads before
// « Accepter »; « Refuser » or a later change of mind stops measuring and clears its cookies.
// The choice lasts 6 months (lib/consent). `children` = the banner text, rendered on the server.
export function CookieConsent({
  gaId,
  title,
  refuseLabel,
  acceptLabel,
  children,
}: {
  gaId: string
  title: string
  refuseLabel: string
  acceptLabel: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const consent = readConsent()
    if (consent === 'granted') loadAnalytics(gaId)
    else if (consent === null) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(openEvent, reopen)
    return () => window.removeEventListener(openEvent, reopen)
  }, [gaId])

  const choose = useCallback(
    (value: Consent) => {
      saveConsent(value)
      if (value === 'granted') loadAnalytics(gaId)
      else {
        window[`ga-disable-${gaId}`] = true
        clearAnalyticsCookies()
      }
      setOpen(false)
    },
    [gaId],
  )

  if (!open) return null
  const button =
    'min-h-9 flex-1 rounded-full px-4 text-sm font-bold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
  return (
    <section
      aria-labelledby="cookies-titre"
      className="fixed inset-x-4 bottom-4 z-50 flex animate-in flex-col gap-2.5 rounded-2xl border border-border/50 bg-card p-4.5 shadow-[0_20px_50px_rgb(40_36_90/0.16)] fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none sm:left-auto sm:max-w-xs"
    >
      <h2 id="cookies-titre" className="font-heading text-base font-semibold">
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-foreground-soft [&_a]:font-semibold [&_a]:text-primary-strong [&_a]:underline [&_a]:underline-offset-4">
        {children}
      </div>
      {/* Same size and weight for both answers: refusing is as easy as accepting. */}
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => choose('denied')}
          className={`${button} bg-foreground text-background hover:bg-foreground/85`}
        >
          {refuseLabel}
        </button>
        <button
          type="button"
          onClick={() => choose('granted')}
          className={`${button} bg-primary text-primary-foreground hover:bg-primary-strong`}
        >
          {acceptLabel}
        </button>
      </div>
    </section>
  )
}

// Footer link that reopens the banner to change one's mind.
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(openEvent))}
      className="text-foreground underline underline-offset-4 hover:text-primary-strong"
    >
      {label}
    </button>
  )
}
