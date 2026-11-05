'use client'

import { Check, CopySimple } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

// Small round icon button (larger invisible hit area: 44px) copying a text (contact e-mail). Says « Copié ! » for a moment, also to
// screen readers. Hidden when the browser can't copy.
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [canCopy, setCanCopy] = useState(false)
  const [copied, setCopied] = useState(false)
  useEffect(() => setCanCopy(Boolean(navigator.clipboard)), [])
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  if (!canCopy) return null
  return (
    <>
      <button
        type="button"
        onClick={() =>
          navigator.clipboard.writeText(value).then(
            () => setCopied(true),
            () => {},
          )
        }
        aria-label={label}
        title={copied ? 'Copié !' : label}
        className="relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#d4d9d6] bg-card text-foreground transition-colors before:absolute before:-inset-2 before:content-[''] hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {copied ? <Check aria-hidden="true" size={14} /> : <CopySimple aria-hidden="true" size={14} />}
      </button>
      <span role="status" className="text-base font-semibold text-success-foreground">
        {copied ? 'Copié !' : ''}
      </span>
    </>
  )
}
