import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

const idOf = (value: unknown) =>
  typeof value === 'string'
    ? value
    : value && typeof value === 'object' && 'id' in value
      ? String(value.id)
      : null

// What the Témoignages page filters on, per published testimonial (admin order): its categories
// and sector, or those of its project when left empty. Plus the categories in use, in their order.
export async function getTestimonialFilters() {
  'use cache'
  cacheLife('model')
  cacheTag(
    tags.collection('testimonials'),
    tags.collection('projects'),
    tags.collection('project-categories'),
  )
  const payload = await getPayload()
  const [{ docs }, { docs: categories }] = await Promise.all([
    payload.find({
      collection: 'testimonials',
      where: { _status: { equals: 'published' } },
      sort: '_order',
      limit: 0,
      pagination: false,
      depth: 1,
      select: { categories: true, sector: true, project: true },
      populate: { projects: { categories: true, sector: true } },
    }),
    payload.find({
      collection: 'project-categories',
      sort: '_order',
      limit: 0,
      pagination: false,
      depth: 0,
      select: { title: true },
    }),
  ])
  const items = docs.map((doc) => {
    const project = typeof doc.project === 'object' ? doc.project : null
    const own = (doc.categories ?? []).map(idOf).filter((id): id is string => Boolean(id))
    const inherited = (project?.categories ?? []).map(idOf).filter((id): id is string => Boolean(id))
    return {
      id: String(doc.id),
      categoryIds: own.length ? own : inherited,
      sector: (doc.sector || project?.sector || '').trim() || null,
    }
  })
  const used = new Set(items.flatMap((item) => item.categoryIds))
  return {
    items,
    categories: categories
      .filter((category) => used.has(String(category.id)))
      .map((category) => ({ id: String(category.id), title: category.title })),
    sectors: [...new Set(items.flatMap((item) => (item.sector ? [item.sector] : [])))].sort((a, b) =>
      a.localeCompare(b, 'fr'),
    ),
  }
}
