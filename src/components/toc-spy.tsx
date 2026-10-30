'use client'

import { type ComponentProps, useEffect, useRef } from 'react'

// Table of contents that marks (aria-current) the link of the section being read: the last
// linked section whose top has scrolled past a third of the viewport.
export function TocSpy(props: ComponentProps<'nav'>) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const links = [...(ref.current?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]') ?? [])]
    const targets = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
    let frame = 0

    const update = () => {
      frame = 0
      const line = window.innerHeight / 3
      let active = -1
      targets.forEach((target, index) => {
        if (target && target.getBoundingClientRect().top <= line) active = index
      })
      links.forEach((link, index) => {
        if (index === active) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      })
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <nav ref={ref} {...props} />
}
