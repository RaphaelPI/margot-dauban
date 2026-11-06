import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

// Title and SEO of a text page, for the browser tab and search engines.
export async function getPageMeta(id: string) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('pages', id))
  const payload = await getPayload()
  const page = await payload.findByID({ collection: 'pages', id, depth: 0, disableErrors: true })
  return page
    ? { title: page.seo?.title || page.title, description: page.seo?.description ?? undefined }
    : null
}
