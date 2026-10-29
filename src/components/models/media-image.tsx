import Image from 'next/image'
import type { Media } from '@/payload-types'

// Not cached itself: rendered inside a model component, which tags the media id.
export function MediaImage({
  media,
  className,
  sizes,
  priority,
}: {
  media: Media | string | null | undefined
  className?: string
  sizes?: string
  priority?: boolean
}) {
  if (!media || typeof media === 'string' || !media.url) return null
  return (
    <Image
      src={media.url}
      alt={media.alt}
      width={media.width ?? 1600}
      height={media.height ?? 900}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
