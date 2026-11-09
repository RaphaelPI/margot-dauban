import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

// Name of a project category, for the title of its filtered Projects page.
export async function getProjectCategoryTitle(id: string) {
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
  return category?.title ?? null
}
