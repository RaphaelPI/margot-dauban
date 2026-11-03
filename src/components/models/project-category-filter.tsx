import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'
import { getProjectIdsInCategory } from '@/data/ids'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { filterCountClass, filterLinkClass } from './project-filter-style'

// One filter of the Projects page: category name, its number of projects, link to the filtered list.
// `active` is UI state (which filter the visitor picked), not data.
export async function ProjectCategoryFilter({ id, active }: { id: string; active: boolean }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('project-categories', id))
  const payload = await getPayload()
  const category = await payload.findByID({
    collection: 'project-categories',
    id,
    depth: 0,
    disableErrors: true,
  })
  if (!category) return null
  const count = (await getProjectIdsInCategory(id)).length
  if (!count) return null

  return (
    <Link
      href={`/projets?categorie=${encodeURIComponent(category.slug ?? id)}`}
      scroll={false}
      aria-current={active ? 'page' : undefined}
      className={filterLinkClass}
    >
      {category.title}
      <span className={filterCountClass}>{count}</span>
    </Link>
  )
}
