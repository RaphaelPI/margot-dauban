'use client'

import { type ComponentProps, useCallback, useEffect, useLayoutEffect, useRef } from 'react'

// Segmented control: one white container, an indigo pill that slides under the current link
// (aria-current="page"). The pill moves on click, before the new page arrives; scrolls
// horizontally on small screens.
export function SlidingTabs({ children, className = '', ...props }: ComponentProps<'nav'>) {
  const rail = useRef<HTMLDivElement>(null)
  const pill = useRef<HTMLSpanElement>(null)

  const moveTo = useCallback((link: HTMLElement | null | undefined, animate: boolean) => {
    const el = pill.current
    if (!el || !link) return
    el.style.transitionDuration = animate ? '' : '0s'
    el.style.left = `${link.offsetLeft}px`
    el.style.width = `${link.offsetWidth}px`
    el.style.opacity = '1'
    link.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: animate ? 'smooth' : 'auto' })
  }, [])
  const moveToCurrent = useCallback(
    (animate: boolean) => moveTo(rail.current?.querySelector<HTMLElement>('[aria-current="page"]'), animate),
    [moveTo],
  )

  // After every render (first load: no animation; filter change: slide).
  const placed = useRef(false)
  useLayoutEffect(() => {
    moveToCurrent(placed.current)
    placed.current = true
  })

  useEffect(() => {
    const onResize = () => moveToCurrent(false)
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [moveToCurrent])

  return (
    <nav
      {...props}
      className={`max-w-full overflow-x-auto rounded-full border border-border/50 bg-card p-1.5 shadow-[0_10px_26px_rgb(40_36_90/0.06)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: moves the pill on a link click (links stay the interactive elements) */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: links are activated by keyboard too; this only anticipates the pill */}
      <div
        ref={rail}
        className="relative inline-flex gap-0.5"
        onClick={(event) => moveTo((event.target as HTMLElement).closest('a'), true)}
      >
        <span
          ref={pill}
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-0 rounded-full bg-primary opacity-0 shadow-[0_8px_18px_rgb(79_70_229/0.3)] transition-[left,width] duration-450 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
        />
        {children}
      </div>
    </nav>
  )
}
