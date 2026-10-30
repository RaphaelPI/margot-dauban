import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'
import { GlowCard } from '@/components/glow-card'
import { tagDocs, tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { MediaImage } from './media-image'

// « Projet suivant » card at the bottom of a case study.
export async function ProjectNextCard({ id }: { id: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('projects', id))
  const payload = await getPayload()
  const project = await payload.findByID({ collection: 'projects', id, depth: 1, disableErrors: true })
  if (!project) return null
  tagDocs('media', project.cover)

  return (
    <section aria-labelledby="projet-suivant" className="pb-18">
      <GlowCard className="grid items-center gap-7 rounded-[1.75rem] border bg-card p-5 hover:border-accent hover:shadow-[0_16px_36px_rgb(79_70_229/0.06)] has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-primary md:grid-cols-2">
        <div className="flex flex-col gap-2.5 p-3">
          <h2
            id="projet-suivant"
            className="text-base font-bold tracking-[0.06em] text-muted-foreground uppercase"
          >
            Projet suivant
          </h2>
          {/* The link covers the whole card (after:inset-0); the card shows its focus ring. */}
          <Link
            href={`/projets/${project.slug}`}
            className="font-heading text-[1.625rem] font-semibold outline-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] hover:text-primary-strong md:text-[1.875rem]"
          >
            {project.title} →
          </Link>
          <p className="text-foreground-soft">{project.summary}</p>
        </div>
        <div className="overflow-hidden rounded-[1.125rem] bg-muted">
          <MediaImage
            media={project.cover}
            sizes="(min-width: 768px) 560px, 100vw"
            className="aspect-video w-full object-cover"
          />
        </div>
      </GlowCard>
    </section>
  )
}
