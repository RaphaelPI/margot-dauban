import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { tagDocs, tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { MediaImage } from './media-image'

export async function ProjectCard({ id }: { id: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('projects', id))
  const payload = await getPayload()
  const project = await payload.findByID({ collection: 'projects', id, depth: 1, disableErrors: true })
  if (!project) return null
  tagDocs('media', project.cover)

  return (
    <Link href={`/projets/${project.slug}`} className="group block">
      <Card className="h-full overflow-hidden pt-0 transition-shadow group-hover:shadow-md">
        <MediaImage
          media={project.cover}
          sizes="(min-width: 768px) 33vw, 100vw"
          className="aspect-[4/3] w-full object-cover"
        />
        <CardHeader className="gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{project.kind}</Badge>
            {project.sector ? <Badge variant="outline">{project.sector}</Badge> : null}
          </div>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.summary}</CardDescription>
          <span className="text-sm font-medium">Découvrir le projet →</span>
        </CardHeader>
      </Card>
    </Link>
  )
}
