import { preload } from 'react-dom'
import type { Media } from '@/payload-types'

type Variant = { url?: string | null; width?: number | null }

// Responsive candidates: the WebP widths Payload generated at upload (src/collections/Media.ts).
// No variant (SVG, media uploaded before the sizes existed, original smaller than every width) or
// an animated GIF (variants keep only its first frame) → the original file alone.
const candidates = (media: Media): { url: string; width: number }[] => {
  const variants = Object.values((media.sizes ?? {}) as Record<string, Variant>)
    .filter((v): v is { url: string; width: number } => Boolean(v?.url && v.width))
    .sort((a, b) => a.width - b.width)
  if (variants.length && media.mimeType !== 'image/gif') return variants
  return media.url && media.width ? [{ url: media.url, width: media.width }] : []
}

// Not cached itself: rendered inside a model component, which tags the media id.
// A plain <img>: next/image would send every request through Vercel's (billed) optimizer.
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
  // Media also holds videos and animations (JSON): only images are rendered here.
  if (media.mimeType && !media.mimeType.startsWith('image/')) return null
  const list = candidates(media)
  const src = list.at(-1)?.url ?? media.url
  const srcSet = list.length > 1 ? list.map((c) => `${c.url} ${c.width}w`).join(', ') : undefined
  // Above the fold: fetched first, like next/image's `priority`.
  if (priority) preload(src, { as: 'image', fetchPriority: 'high', imageSrcSet: srcSet, imageSizes: sizes })
  return (
    // biome-ignore lint/performance/noImgElement: sizes are pre-generated at upload, see above
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? (sizes ?? '100vw') : undefined}
      alt={media.alt}
      width={media.width ?? undefined}
      height={media.height ?? undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={className}
    />
  )
}
