'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayoutEffect, useRef, useState } from 'react'

type NavLink = { id?: string | null; label: string; href: string }

// Is `href` the page being shown? Exact match for the home page, section match otherwise
// (/projets is active on /projets/le-bikini). Anchors and query strings are ignored.
export const isActive = (href: string, pathname: string) => {
  const path = href.split(/[?#]/)[0] || '/'
  if (!path.startsWith('/')) return false
  if (path === '/') return pathname === '/'
  return pathname === path || pathname.startsWith(`${path}/`)
}

// Desktop menu links: the current page's entry is bold (dark text), with a 6px indigo dot
// centred under it that slides to the new entry when the page changes.
export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname()
  const active = links.findIndex((link) => isActive(link.href, pathname))
  const items = useRef<(HTMLAnchorElement | null)[]>([])
  const [dot, setDot] = useState<{ x: number; animate: boolean } | null>(null)

  const list = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const el = active >= 0 ? items.current[active] : null
    if (!el) return setDot(null)
    const x = () => el.offsetLeft + el.offsetWidth / 2 - 3
    // No slide on the first placement, only from one entry to another.
    setDot((previous) => ({ x: x(), animate: previous !== null }))
    // Re-centre when the menu's size changes (window resize, fonts loading).
    const observer = new ResizeObserver(() =>
      setDot((previous) => (previous ? { ...previous, x: x() } : previous)),
    )
    if (list.current) observer.observe(list.current)
    observer.observe(el)
    return () => observer.disconnect()
  }, [active])

  return (
    <span ref={list} className="relative flex flex-wrap items-center gap-x-7 gap-y-3">
      {links.map((link, index) => {
        const current = index === active
        return (
          <Link
            key={link.id ?? link.href}
            ref={(el) => {
              items.current[index] = el
            }}
            href={link.href}
            aria-current={current ? 'page' : undefined}
            className={`grid hover:text-primary-strong ${current ? 'font-bold' : ''}`}
          >
            {/* The bold copy keeps the width steady when the entry becomes active. */}
            <span aria-hidden="true" className="invisible col-start-1 row-start-1 font-bold">
              {link.label}
            </span>
            <span className="col-start-1 row-start-1">{link.label}</span>
          </Link>
        )
      })}
      {dot ? (
        <span
          aria-hidden="true"
          className={`absolute -bottom-2.5 left-0 size-1.5 rounded-full bg-primary ${dot.animate ? 'transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none' : ''}`}
          style={{ transform: `translateX(${dot.x}px)` }}
        />
      ) : null}
    </span>
  )
}
