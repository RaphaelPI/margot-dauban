'use client'

import { type ComponentProps, useEffect, useRef } from 'react'

// Site header that publishes its real height as `--header-h` on <html>, so sticky columns and
// anchor targets sit just below it whatever the number of lines the menu wraps onto.
export function StickyHeader(props: ComponentProps<'header'>) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = ref.current
    if (!header) return
    const root = document.documentElement
    const observer = new ResizeObserver(() => {
      root.style.setProperty('--header-h', `${Math.ceil(header.getBoundingClientRect().height)}px`)
    })
    observer.observe(header)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--header-h')
    }
  }, [])

  return <header ref={ref} {...props} />
}
