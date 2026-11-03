import { LottiePlayer } from '@/components/lottie-player'
import type { Media } from '@/payload-types'
import { MediaImage } from './media-image'

// An expertise's visual: a Lottie animation (.json) or an image. Not cached itself: rendered
// inside a model component, which tags the media id.
export function ServiceVisual({
  media,
  className,
}: {
  media: Media | string | null | undefined
  className?: string
}) {
  if (!media || typeof media === 'string' || !media.url) return null
  if (media.mimeType === 'application/json') return <LottiePlayer src={media.url} className={className} />
  return <MediaImage media={media} sizes="150px" className={`object-contain ${className ?? ''}`} />
}
