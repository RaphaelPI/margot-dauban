import Link from 'next/link'
import type { ReactNode } from 'react'

// Main call to action (designs/38-boutons-liens « CTA principal »): a capsule whose round arrow
// breaks free on hover / focus (SVG « goo » filter #cta-goo, defined once in the layout).
// Tones: indigo (default), black, white (on indigo). `compact` = header size.
export function CtaLink({
  href,
  children,
  tone = 'indigo',
  compact = false,
  className,
  onClick,
}: {
  href: string
  onClick?: () => void
  children: ReactNode
  tone?: 'indigo' | 'black' | 'white'
  compact?: boolean
  className?: string
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`cta ${className ?? ''}`}
      data-tone={tone}
      data-compact={compact || undefined}
    >
      <span aria-hidden="true" className="cta-bg">
        <span className="cta-pill" />
        <span className="cta-dot" />
      </span>
      {children}
      <span aria-hidden="true" className="cta-arrow">
        <span className="cta-glyph">→</span>
      </span>
    </Link>
  )
}

// The « goo » filter merging the capsule and its round while they separate.
export function CtaGooFilter() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <filter id="cta-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  )
}
