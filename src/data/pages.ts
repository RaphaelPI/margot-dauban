import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

export async function getPageIdBySlug(slug: string) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.collection('pages'))
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    select: {},
    depth: 0,
    limit: 1,
  })
  return docs[0]?.id ?? null
}
