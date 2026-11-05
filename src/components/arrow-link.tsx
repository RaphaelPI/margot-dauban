import Link from 'next/link'
import type { ReactNode } from 'react'

// Secondary link « souligné à pastille » (designs/38-boutons-liens): bold text, a lilac round
// with a pictogram; on hover the underline draws itself, the round turns indigo and the
// pictogram makes its gesture (arrow turns, external flies off, down drops, mail tilts).
// External links (http…) open in a new tab.

const icons = {
  // Lucide « arrow-right », scaled to the 16px box.
  arrow: <path d="M3.33 8h9.34M8 3.33 12.67 8 8 12.67" />,
  external: <path d="M5 11l6-6M6 5h5v5" />,
  down: <path d="M8 3v10M4 9l4 4 4-4" />,
  mail: (
    <>
      <rect x="2" y="3.5" width="12" height="9" rx="2" />
      <path d="M2.5 4.5L8 8.5l5.5-4" />
    </>
  ),
  phone: (
    <path d="M4 2.5h2l1 3-1.5 1a8 8 0 0 0 4 4l1-1.5 3 1v2a1.5 1.5 0 0 1-1.5 1.5A10.5 10.5 0 0 1 2.5 4 1.5 1.5 0 0 1 4 2.5z" />
  ),
}
export type ArrowLinkIcon = keyof typeof icons

// Icon matching a link: mailto → mail, tel → phone, http → external, #anchor → down, else arrow.
export const iconFor = (href: string): ArrowLinkIcon =>
  href.startsWith('mailto:')
    ? 'mail'
    : href.startsWith('tel:')
      ? 'phone'
      : /^https?:/.test(href)
        ? 'external'
        : href.startsWith('#')
          ? 'down'
          : 'arrow'

export function ArrowLink({
  href,
  children,
  icon = iconFor(href),
  className,
}: {
  href: string
  children: ReactNode
  icon?: ArrowLinkIcon
  className?: string
}) {
  const external = /^https?:/.test(href)
  const content = (
    <>
      <span className="arrow-link-text">{children}</span>
      {external ? <span className="sr-only"> (nouvel onglet)</span> : null}
      <span aria-hidden="true" className="arrow-link-icon">
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icons[icon]}
        </svg>
      </span>
    </>
  )
  const props = { className: `arrow-link ${className ?? ''}`, 'data-icon': icon }
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {content}
      </a>
    )
  }
  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {content}
      </Link>
    )
  }
  return (
    <a href={href} {...props}>
      {content}
    </a>
  )
}
