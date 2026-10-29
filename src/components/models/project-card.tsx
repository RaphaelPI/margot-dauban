import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { MediaImage } from './media-image'

export async function ProjectCard({ id }: { id: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('projects', id))
  const payload = await getPayload()
  const project = await payload.findByID({ collection: 'projects', id, depth: 1, disableErrors: true })
  if (!project) return null
  if (typeof project.cover === 'object') cacheTag(tags.doc('media', project.cover.id))

  return (
    <Link href={`/projets/${project.slug}`} className="group block">
      <Card className="h-full overflow-hidden pt-0 transition-shadow group-hover:shadow-md">
        <MediaImage
          media={project.cover}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-video w-full object-cover"
        />
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.summary}</CardDescription>
        </CardHeader>
        {project.tags?.length ? (
          <CardContent className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </CardContent>
        ) : null}
      </Card>
    </Link>
  )
}
