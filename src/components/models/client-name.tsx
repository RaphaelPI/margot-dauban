import { cacheLife, cacheTag } from 'next/cache'
import { tagDocs, tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { MediaImage } from './media-image'

export async function ClientName({ id }: { id: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('clients', id))
  const payload = await getPayload()
  const client = await payload.findByID({ collection: 'clients', id, depth: 1, disableErrors: true })
  if (!client) return null
  tagDocs('media', client.logo)

  return typeof client.logo === 'object' && client.logo ? (
    <MediaImage media={client.logo} sizes="160px" className="h-7 w-auto object-contain" />
  ) : (
    <span className="text-[1.1875rem] font-bold whitespace-nowrap">{client.name}</span>
  )
}
