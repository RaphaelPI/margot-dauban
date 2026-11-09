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
  findIds('projects', { where: { and: [published, { featured: { equals: true } }] }, sort: '_order', limit })

export const getProjectIdBySlug = async (slug: string) =>
  (await findIds('projects', { where: { and: [published, { slug: { equals: slug } }] }, limit: 1 }))[0] ??
  null

export const getPageIdBySlug = async (slug: string) =>
  (await findIds('pages', { where: { and: [published, { slug: { equals: slug } }] }, limit: 1 }))[0] ?? null

export const getFaqIdsInCategory = (category: string) =>
  findIds('faqs', { where: { category: { equals: category } }, sort: '_order' })

export const getClientIds = () => findIds('clients', { sort: '_order' })

export const getServiceIds = () => findIds('services', { sort: '_order' })

export const getHomeServiceIds = () =>
  findIds('services', { where: { showOnHome: { equals: true } }, sort: '_order' })

// Projects are ordered by hand in the admin (drag and drop): the same order everywhere.
export const getProjectIds = () => findIds('projects', { where: published, sort: '_order' })

export const getProjectIdsInCategory = (categoryId: string) =>
  findIds('projects', {
    where: { and: [published, { categories: { in: [categoryId] } }] },
    sort: '_order',
  })

export const getProjectCategoryIds = () => findIds('project-categories', { sort: '_order' })

export const getProjectCategoryIdBySlug = async (slug: string) =>
  (await findIds('project-categories', { where: { slug: { equals: slug } }, limit: 1 }))[0] ?? null

export const getNextProjectId = async (id: string) => nextInList(await getProjectIds(), id)

// Route params for `generateStaticParams` only (prerender every page at build).
// Rendering still goes through the id lookups above. `where` = `published` for collections with drafts.
async function findSlugs(collection: 'projects' | 'pages' | 'project-categories', where?: Where) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.collection(collection))
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection,
    where,
    limit: 0,
    pagination: false,
    select: { slug: true },
    depth: 0,
  })
  return docs.flatMap((doc) => (doc.slug ? [{ slug: doc.slug }] : []))
}

export const getProjectSlugs = () => findSlugs('projects', published)

export const getPageSlugs = () => findSlugs('pages', published)

export const getProjectCategorySlugs = () => findSlugs('project-categories')
