'use client'

import { type ComponentProps, useEffect, useRef, useState } from 'react'

// Site header that publishes its real height as `--header-h` on <html>, so sticky columns and
// anchor targets sit just below it whatever the number of lines the menu wraps onto. Once the
// page is scrolled it gets `data-scrolled`: more compact, name and badge fold away (globals.css).
export function StickyHeader(props: ComponentProps<'header'>) {
  const ref = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 24)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

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

  return <header ref={ref} data-scrolled={scrolled || undefined} {...props} />
}
