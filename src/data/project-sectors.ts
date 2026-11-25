import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { isPreview } from '@/lib/preview'

// Sector of every published project (drafts too while previewing), for the Projects page chips.
export async function getProjectSectors(): Promise<Record<string, string | null>> {
  'use cache'
  cacheLife('model')
  cacheTag(tags.collection('projects'))
  const payload = await getPayload()
  const draft = await isPreview()
  const { docs } = await payload.find({
    collection: 'projects',
    where: draft ? undefined : { _status: { equals: 'published' } },
    draft,
    limit: 0,
    pagination: false,
    depth: 0,
    select: { sector: true },
  })
  return Object.fromEntries(docs.map((doc) => [String(doc.id), doc.sector?.trim() || null]))
}
