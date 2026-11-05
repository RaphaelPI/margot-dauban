import { cacheLife, cacheTag } from 'next/cache'
import { ArrowLink } from '@/components/arrow-link'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

// « Lire le cas client »-style link to a project page, by project id. Nothing while the project
// is missing or not published.
export async function ProjectLink({ id, label }: { id: string; label: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('projects', id))
  const payload = await getPayload()
  const project = await payload.findByID({ collection: 'projects', id, depth: 0, disableErrors: true })
  if (!project?.slug || project._status !== 'published') return null
  return <ArrowLink href={`/projets/${project.slug}`}>{label}</ArrowLink>
}
