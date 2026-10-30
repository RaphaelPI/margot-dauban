import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'
import { GlowCard } from '@/components/glow-card'
import { Badge } from '@/components/ui/badge'
import { tagDocs, tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { MediaImage } from './media-image'

const tag = 'h-auto rounded-md px-2.5 py-1.25 text-xs font-bold'

export async function ProjectCard({ id }: { id: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('projects', id))
  const payload = await getPayload()
  const project = await payload.findByID({ collection: 'projects', id, depth: 1, disableErrors: true })
  if (!project) return null
  tagDocs('media', project.cover)

  return (
    <GlowCard className="flex flex-col gap-4.5 rounded-xl border bg-card p-3.5 hover:border-accent hover:shadow-[0_16px_36px_rgb(79_70_229/0.06)] has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-primary">
      <div className="overflow-hidden rounded-[0.875rem] bg-muted">
        <MediaImage
          media={project.cover}
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
          className="aspect-[3/2] w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-3 px-2 pb-2.5">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className={tag}>
            {project.kind}
          </Badge>
          {project.sector ? (
            <Badge className={`${tag} bg-tag-warm text-tag-warm-foreground`}>{project.sector}</Badge>
          ) : null}
        </div>
        <h3 className="font-heading text-[1.375rem] font-semibold">{project.title}</h3>
        <p className="text-base leading-relaxed text-foreground-soft">{project.summary}</p>
        {/* The link covers the whole card (after:inset-0); the card shows its focus ring. */}
        <Link
          href={`/projets/${project.slug}`}
          aria-label={`Découvrir le projet ${project.title}`}
          className="self-start font-bold underline underline-offset-4 outline-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] hover:text-primary-strong"
        >
          Découvrir le projet →
        </Link>
      </div>
    </GlowCard>
  )
}
