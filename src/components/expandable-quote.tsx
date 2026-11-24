'use client'

import { type ReactNode, useId, useState } from 'react'

// A long testimonial shows its first words (`excerpt`, « … » glued to the last word) and
// « Voir plus » for the whole text (`full`). Without an excerpt, only the text.
export function ExpandableQuote({ excerpt, full }: { excerpt?: ReactNode; full: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  if (!excerpt) return <div className="[&>*+*]:mt-3">{full}</div>

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div id={id} className="[&>*+*]:mt-3">
        {open ? full : excerpt}
      </div>
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
    </div>
  )
}
