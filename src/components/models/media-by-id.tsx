import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { MediaImage } from './media-image'

// Image of a media doc referenced by id only (globals read at depth 0), cached by that id.
export async function MediaById({
  id,
  className,
  sizes,
}: {
  id: string
  className?: string
  sizes?: string
}) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('media', id))
  const payload = await getPayload()
  const media = await payload.findByID({ collection: 'media', id, depth: 0, disableErrors: true })
  return <MediaImage media={media} className={className} sizes={sizes} />
}
