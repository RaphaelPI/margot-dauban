import { RichText } from '@payloadcms/richtext-lexical/react'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { tagDocs, tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { MediaImage } from './media-image'

const prose = 'prose max-w-none'

export async function ProjectView({ id }: { id: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('projects', id))
  const payload = await getPayload()
  const project = await payload.findByID({ collection: 'projects', id, depth: 1, disableErrors: true })
  if (!project) return null
  tagDocs(
    'media',
    project.cover,
    project.hero,
    project.gallery,
    project.approach?.map((step) => step.images),
  )

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-12">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{project.kind}</Badge>
          {project.sector ? <Badge variant="outline">{project.sector}</Badge> : null}
          {project.year ? <Badge variant="outline">{project.year}</Badge> : null}
        </div>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">{project.title}</h1>
        {project.lead ? (
          <RichText data={project.lead} className={`${prose} text-lg text-muted-foreground`} />
        ) : null}
        {project.interventions?.length ? (
          <section aria-labelledby="interventions">
            <h2 id="interventions" className="text-sm font-medium text-muted-foreground">
              Interventions
            </h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {project.interventions.map((item) => (
                <li key={item}>
                  <Badge variant="outline">{item}</Badge>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </header>

      <MediaImage
        media={project.hero ?? project.cover}
        priority
        sizes="(min-width: 768px) 768px, 100vw"
        className="w-full rounded-xl"
      />

      {project.context ? (
        <Section title="Contexte & objectifs">
          <RichText data={project.context} className={prose} />
        </Section>
      ) : null}
      {project.constraints ? (
        <Section title="Contraintes">
          <RichText data={project.constraints} className={prose} />
        </Section>
      ) : null}

      {project.approach?.length ? (
        <Section title={project.approachTitle ?? 'Démarche et solutions'}>
          {project.approach.map((step) => (
            <div key={step.id ?? step.title} className="flex flex-col gap-4">
              <h3 className="font-heading text-xl font-semibold">{step.title}</h3>
              {step.content ? <RichText data={step.content} className={prose} /> : null}
              {step.images?.map((image) => (
                <MediaImage
                  key={typeof image === 'object' ? image.id : image}
                  media={image}
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="w-full rounded-lg"
                />
              ))}
            </div>
          ))}
        </Section>
      ) : null}

      {project.metrics?.length || project.results ? (
        <Section title={project.resultsTitle ?? 'Résultats'}>
          {project.metrics?.length ? (
            <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {project.metrics.map((metric) => (
                <div key={metric.id ?? metric.label}>
                  <dt className="text-sm text-muted-foreground">{metric.label}</dt>
                  <dd className="font-heading text-3xl font-semibold">{metric.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {project.results ? <RichText data={project.results} className={prose} /> : null}
        </Section>
      ) : null}

      {project.website?.url ? (
        <Button asChild variant="outline" className="self-start">
          <a href={project.website.url} target="_blank" rel="noopener noreferrer">
            {project.website.label ?? 'Voir le site'}
          </a>
        </Button>
      ) : null}

      {project.gallery?.map((image) => (
        <MediaImage
          key={typeof image === 'object' ? image.id : image}
          media={image}
          sizes="(min-width: 768px) 768px, 100vw"
          className="w-full rounded-xl"
        />
      ))}

      <aside className="flex flex-col items-start gap-4 rounded-xl bg-muted p-8">
        <h2 className="font-heading text-2xl font-semibold">Un projet similaire ?</h2>
        <Button asChild>
          <Link href="/contact">Contactez-moi</Link>
        </Button>
      </aside>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-heading text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  )
}
