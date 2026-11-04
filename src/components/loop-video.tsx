'use client'

import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Media } from '@/payload-types'

// MP4 shown like a GIF (case study steps): muted, looping, plays by itself unless the visitor
// asked for reduced motion. A pause / play button keeps it under the visitor's control.
export function LoopVideo({ media, className }: { media: Media; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Browsers may still refuse autoplay (data saver…): the button stays on « Lire ».
    video.play().catch(() => {})
  }, [])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  if (!media.url) return null
  return (
    <figure className={`relative overflow-hidden ${className ?? ''}`}>
      <video
        ref={ref}
        src={media.url}
        aria-label={media.alt}
        width={media.width ?? undefined}
        height={media.height ?? undefined}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="block h-auto w-full"
      />
      <Button
        type="button"
        size="icon"
        variant="secondary"
        onClick={toggle}
        aria-label={playing ? 'Mettre la vidéo en pause' : 'Lire la vidéo'}
        className="absolute right-3 bottom-3 size-11 rounded-full bg-card/90 shadow-md backdrop-blur hover:bg-card"
      >
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </Button>
    </figure>
  )
}
