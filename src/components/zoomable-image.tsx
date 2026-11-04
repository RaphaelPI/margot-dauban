'use client'

import { X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { type ReactNode, useState } from 'react'

// Click (or Enter / Space) on an image in a case study to see it whole, full screen on a dark
// backdrop: wireframes and site maps become readable. Taller than the screen → it scrolls.
// Closes with the cross, Escape or a click beside the image; focus returns to the image.
export function ZoomableImage({
  src,
  alt,
  width,
  height,
  className,
  children,
}: {
  src: string
  alt: string
  width?: number | null
  height?: number | null
  className?: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={`Agrandir l'image : ${alt}`}
        className={`block w-full cursor-zoom-in rounded-[inherit] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${className ?? ''}`}
      >
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/90 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none" />
        {/* The content fills the screen and scrolls; a click on its empty area closes it. */}
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex overflow-y-auto overscroll-contain p-4 outline-none md:p-10"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
        >
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          {/* biome-ignore lint/performance/noImgElement: full-size original, shown as uploaded */}
          <img
            src={src}
            alt={alt}
            width={width ?? undefined}
            height={height ?? undefined}
            className="m-auto h-auto max-w-full rounded-lg bg-card shadow-2xl"
          />
          <Dialog.Close
            aria-label="Fermer"
            className="fixed top-4 right-4 flex size-11 items-center justify-center rounded-full bg-card text-foreground shadow-md hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <X aria-hidden="true" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
