'use client'

import { cn } from 'cn'
import type { ComponentProps, MouseEvent } from 'react'

// Card whose `glow` halo (globals.css) follows the pointer.
export function GlowCard({
  as: Tag = 'article',
  className,
  ...props
}: ComponentProps<'div'> & { as?: 'article' | 'div' }) {
  const follow = (event: MouseEvent<HTMLElement>) => {
    const el = event.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }
  return <Tag className={cn('glow', className)} onMouseMove={follow} {...props} />
}
