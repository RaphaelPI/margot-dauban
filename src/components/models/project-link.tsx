import { cacheLife, cacheTag } from 'next/cache'
import { ArrowLink } from '@/components/arrow-link'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { isPreview, isShown } from '@/lib/preview'

// « Lire le cas client »-style link to a project page, by project id. Nothing while the project
// is missing or not published.
export async function ProjectLink({ id, label }: { id: string; label: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('projects', id))
  const payload = await getPayload()
  const draft = await isPreview()
  const project = await payload.findByID({ collection: 'projects', id, depth: 0, disableErrors: true, draft })
  if (!project?.slug || !isShown(project, draft)) return null
  return <ArrowLink href={`/projets/${project.slug}`}>{label}</ArrowLink>
}
