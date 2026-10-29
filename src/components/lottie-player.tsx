'use client'

import { cn } from 'cn'
import { useEffect, useRef } from 'react'

// Decorative Lottie animation. The light player (SVG, no expression engine) is loaded
// on demand so pages without animations don't ship it, and uploaded files can't run code.
export function LottiePlayer({ src, className }: { src: string; className?: string }) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = container.current
    if (!el) return
    let destroyed = false
    let destroy: (() => void) | undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    import('lottie-web/build/player/lottie_light').then(({ default: lottie }) => {
      if (destroyed) return
      const animation = lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: !reduce,
        path: src,
      })
      if (reduce) animation.addEventListener('DOMLoaded', () => animation.goToAndStop(40, true))
      destroy = () => animation.destroy()
    })

    return () => {
      destroyed = true
      destroy?.()
    }
  }, [src])

  return <div ref={container} aria-hidden="true" className={cn('pointer-events-none', className)} />
}
