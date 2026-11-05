'use client'

import { type ComponentProps, useRef } from 'react'

// Scrolling track of the client logos: on hover it slows down smoothly to a stop, and speeds
// back up when the pointer leaves (eases the CSS animation's playback rate). With reduced
// motion the CSS animation is off and nothing happens.
export function Marquee({ className, ...props }: ComponentProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const easeTo = (target: number) => {
    const animation = ref.current?.getAnimations()[0]
    if (!animation) return
    cancelAnimationFrame(frame.current)
    const from = animation.playbackRate
    const start = performance.now()
    const duration = 600
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      animation.playbackRate = from + (target - from) * eased
      if (t < 1) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: slows the decorative scrolling on hover
    <div
      ref={ref}
      className={className}
      onMouseEnter={() => easeTo(0)}
      onMouseLeave={() => easeTo(1)}
      {...props}
    />
  )
}
