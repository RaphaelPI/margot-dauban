'use client'

import { type ReactNode, useId, useLayoutEffect, useRef, useState } from 'react'

// A long testimonial is folded to a few lines with « Voir plus » (designs: testimonials page).
// The button only shows when the text is actually cut.
export function ExpandableQuote({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [cut, setCut] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const id = useId()

  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const measure = () => {
      if (!open) setCut(el.scrollHeight > el.clientHeight + 1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [open])

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div id={id} ref={box} className={`[&>*+*]:mt-3 ${open ? '' : 'line-clamp-7'}`}>
        {children}
      </div>
      {cut || open ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-primary-strong hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {open ? 'Voir moins' : 'Voir plus'}
          <span
            aria-hidden="true"
            className={`inline-block transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          >
            ▾
          </span>
        </button>
      ) : null}
    </div>
  )
}
