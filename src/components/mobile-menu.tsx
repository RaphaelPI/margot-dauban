'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { isSafeHref } from '@/lib/safe-href'

type NavLink = { id?: string | null; label: string; href: string }

// Phone menu (designs/34-menu-mobile): a burger that turns into a cross and drops a full-screen
// indigo panel. While open, the page behind can't scroll nor be reached (inert), Escape or any
// link closes it, and the header turns white over the panel (`data-menu` on <html>).
export function MobileMenu({
  links,
  cta,
  smallLinks,
}: {
  links: NavLink[]
  cta?: { label?: string | null; href?: string | null } | null
  smallLinks: NavLink[]
}) {
  const [open, setOpen] = useState(false)
  // The panel is rendered into <body>: the header's blur would otherwise trap a fixed panel.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const button = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  // A link to the current page doesn't navigate: close on any route change and on clicks.
  // biome-ignore lint/correctness/useExhaustiveDependencies: closes when the route changes
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const root = document.documentElement
    const behind = [...document.querySelectorAll<HTMLElement>('body > main, body > footer')]
    if (open) root.dataset.menu = 'open'
    else delete root.dataset.menu
    root.style.overflow = open ? 'hidden' : ''
    for (const el of behind) el.inert = open
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Leaving the phone layout (rotation, resize) closes it.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 48rem)')
    const close = () => wide.matches && setOpen(false)
    wide.addEventListener('change', close)
    return () => wide.removeEventListener('change', close)
  }, [])

  const close = () => setOpen(false)
  const safeSmall = smallLinks.filter((link) => isSafeHref(link.href))

  return (
    <div className="md:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        onClick={() => setOpen((value) => !value)}
        className="burger relative z-10 size-11 rounded-[0.875rem] border bg-card"
        data-open={open}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {mounted
        ? createPortal(
            <nav
              id="menu-mobile"
              aria-label="Menu principal"
              inert={!open}
              data-open={open}
              className="menu-panel md:hidden"
            >
              <ul className="flex flex-col gap-1.5">
                {links.map((link, index) => (
                  <li key={link.id ?? link.href} style={{ '--i': index } as CSSProperties}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className="flex items-baseline gap-3.5 py-2 font-heading text-[1.875rem] font-semibold tracking-[-0.02em]"
                    >
                      <span aria-hidden="true" className="font-sans text-base font-bold text-[#b9b4f5]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-5" style={{ '--i': links.length + 1 } as CSSProperties}>
                {cta?.label && cta.href ? (
                  <Link
                    href={cta.href}
                    onClick={close}
                    className="flex justify-center rounded-full bg-card px-4 py-4 text-base font-bold text-primary-strong"
                  >
                    {cta.label} →
                  </Link>
                ) : null}
                {safeSmall.length ? (
                  <ul className="flex flex-wrap gap-x-4 gap-y-2 text-base font-semibold text-[#e4e2ff]">
                    {safeSmall.map((link) => {
                      const external = link.href.startsWith('http')
                      return (
                        <li key={link.id ?? link.href}>
                          <a
                            href={link.href}
                            onClick={close}
                            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className="underline-offset-4 hover:underline"
                          >
                            {link.label}
                            {external ? <span className="sr-only"> (nouvel onglet)</span> : null}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </div>
            </nav>,
            document.body,
          )
        : null}
    </div>
  )
}
