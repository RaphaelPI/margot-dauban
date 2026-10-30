import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import type { CollectionSlug, Sort, Where } from 'payload'
import { tags } from '@/lib/cache'
import { nextInList } from '@/lib/next-in-list'
import { getPayload } from '@/lib/payload'

const published: Where = { _status: { equals: 'published' } }

// Lookups return ids only; model components fetch and cache each doc by id.
// Collections with drafts must pass `published` in `where` (the Local API skips access control).
export async function findIds(
  collection: CollectionSlug,
  { where, sort, limit }: { where?: Where; sort?: Sort; limit?: number } = {},
) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.collection(collection))
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection,
    where,
    sort,
    limit: limit ?? 0,
    pagination: Boolean(limit),
    select: {},
    depth: 0,
  })
  return docs.map((doc) => String(doc.id))
}

export const getFeaturedProjectIds = (limit = 3) =>
  findIds('projects', { where: { and: [published, { featured: { equals: true } }] }, sort: '-year', limit })

export const getProjectIdBySlug = async (slug: string) =>
  (await findIds('projects', { where: { and: [published, { slug: { equals: slug } }] }, limit: 1 }))[0] ??
  null

export const getPageIdBySlug = async (slug: string) =>
  (await findIds('pages', { where: { and: [published, { slug: { equals: slug } }] }, limit: 1 }))[0] ?? null

export const getClientIds = () => findIds('clients', { sort: '_order' })

export const getHomeServiceIds = () =>
  findIds('services', { where: { showOnHome: { equals: true } }, sort: '_order' })

// Same order as the admin list (newest year first); title breaks ties so the order is stable.
export const getProjectIds = () => findIds('projects', { where: published, sort: ['-year', 'title'] })

export const getNextProjectId = async (id: string) => nextInList(await getProjectIds(), id)
