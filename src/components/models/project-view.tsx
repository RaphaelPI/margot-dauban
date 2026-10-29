import { RichText } from '@payloadcms/richtext-lexical/react'
import { cacheLife, cacheTag } from 'next/cache'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { MediaImage } from './media-image'

export async function ProjectView({ id }: { id: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('projects', id))
  const payload = await getPayload()
  const project = await payload.findByID({ collection: 'projects', id, depth: 1, disableErrors: true })
  if (!project) return null
  if (typeof project.cover === 'object') cacheTag(tags.doc('media', project.cover.id))

  const facts = [
    ['Client', project.client],
    ['Année', project.year],
    ['Rôle', project.role],
  ].filter(([, value]) => value)

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-4">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">{project.title}</h1>
        <p className="text-lg text-muted-foreground">{project.summary}</p>
        {facts.length ? (
          <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {project.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </header>
      <MediaImage
        media={project.cover}
        priority
        sizes="(min-width: 768px) 768px, 100vw"
        className="w-full rounded-xl"
      />
      {project.content ? (
        <>
          <Separator />
          <RichText data={project.content} className="prose max-w-none" />
        </>
      ) : null}
    </article>
  )
}
