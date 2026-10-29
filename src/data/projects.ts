import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

// Lookups return ids only; model components fetch and cache each doc by id.

export async function getProjectIds() {
  'use cache'
  cacheLife('model')
  cacheTag(tags.collection('projects'))
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    select: {},
    depth: 0,
    pagination: false,
  })
  return docs.map((doc) => doc.id)
}

export async function getProjectIdBySlug(slug: string) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.collection('projects'))
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    select: {},
    depth: 0,
    limit: 1,
  })
  return docs[0]?.id ?? null
}
