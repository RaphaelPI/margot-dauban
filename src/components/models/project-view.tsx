import { RichText } from '@payloadcms/richtext-lexical/react'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { GlowCard } from '@/components/glow-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { tagDocs, tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import type { Media } from '@/payload-types'
import { MediaImage } from './media-image'

// Case study template « Cas client — Template mix » (designs/9-template-projet):
// part 1 = summary read at a glance, part 2 = detailed approach. Empty sections are not rendered.

const h2 = 'font-heading text-[1.625rem] leading-tight font-semibold md:text-[1.75rem]'
const h2Lg = 'font-heading text-[1.75rem] leading-[1.15] font-semibold md:text-[1.875rem]'
const kicker = 'text-[0.8125rem] font-bold tracking-[0.06em] uppercase'
const card = 'flex flex-col rounded-xl border bg-card p-6.5'
const chip = 'h-auto rounded-md px-3 py-1.5 text-[0.8125rem] font-bold'
// Rich text from the admin: paragraphs, lists, links, bold (no typography plugin installed).
const body =
  'text-lg leading-[1.7] text-foreground-soft [&_*+*]:mt-4 [&_a]:font-bold [&_a]:underline [&_a]:underline-offset-4 [&_li+li]:mt-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-bold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-6'
const linkClass = 'font-bold underline underline-offset-4 hover:text-primary-strong'

const images = (list: (Media | string)[] | null | undefined) =>
  (list ?? []).filter((item): item is Media => typeof item === 'object' && Boolean(item.url))

export async function ProjectView({ id, nextSlot }: { id: string; nextSlot?: ReactNode }) {
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

  const headline = project.headline?.highlight || project.headline?.text ? project.headline : null
  const gallery = images(project.gallery)
  const steps = (project.approach ?? []).map((step, index) => ({
    ...step,
    num: index + 1,
    anchor: `etape-${index + 1}`,
    short: step.shortTitle || step.title,
    shots: images(step.images),
  }))
  const hasOverview = Boolean(project.challenge || project.response || project.interventions?.length)
  const hasResults = Boolean(project.metrics?.length || project.results)
  const hasContext = Boolean(project.context || project.constraints)
  const hasDetail = hasContext || steps.length > 0
  // Projects saved before the contact band existed get its default texts.
  const cta = project.cta ?? {
    title: 'Un projet similaire ?',
    text: 'Webdesigner freelance à Toulouse, en mission sur place ou à distance.',
    buttonLabel: 'Me contacter',
    buttonHref: '/contact',
  }

  return (
    <article className="flex flex-col">
      <header className="flex flex-col items-center gap-5.5 pt-12 pb-12 text-center md:pt-18">
        <nav aria-label="Fil d’Ariane" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap justify-center gap-1.5">
            <li>
              <Link href="/" className="underline underline-offset-4 hover:text-primary-strong">
                Accueil
              </Link>{' '}
              /
            </li>
            <li>
              <Link href="/#projets" className="underline underline-offset-4 hover:text-primary-strong">
                Projets
              </Link>{' '}
              /
            </li>
            <li aria-current="page">{project.title}</li>
          </ol>
        </nav>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className={chip}>
            {project.kind}
          </Badge>
          {project.sector ? (
            <Badge className={`${chip} bg-tag-warm text-tag-warm-foreground`}>{project.sector}</Badge>
          ) : null}
          {project.year ? (
            <Badge variant="outline" className={`${chip} bg-card py-1.25`}>
              {project.year}
            </Badge>
          ) : null}
        </div>
        <h1 className="font-heading text-[clamp(2.5rem,6vw,5rem)] leading-none font-semibold tracking-[-0.03em] text-balance">
          {project.title}
        </h1>
        <p className="max-w-215 font-heading text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.35] font-medium text-balance">
          {headline ? (
            <>
              {headline.highlight ? <span className="text-primary">{headline.highlight}</span> : null}
              {headline.highlight && headline.text ? ' ' : null}
              {headline.text}
            </>
          ) : (
            project.summary
          )}
        </p>
      </header>

      <section aria-label="Aperçu du projet" className="pb-16 md:pb-22">
        <div className="overflow-hidden rounded-[1.75rem] border bg-muted">
          <MediaImage
            media={project.hero ?? project.cover}
            priority
            sizes="(min-width: 1240px) 1176px, 100vw"
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
      </section>

      {hasOverview ? (
        <section aria-labelledby="bref" className="flex flex-col gap-5 pb-6">
          <h2 id="bref" className={h2}>
            {project.overviewTitle || 'La prestation en bref'}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {project.challenge ? (
              <div className={`${card} gap-2.5`}>
                <h3 className={`${kicker} text-tag-warm-foreground`}>Le défi</h3>
                <p className="leading-relaxed">{project.challenge}</p>
              </div>
            ) : null}
            {project.response ? (
              <div className={`${card} gap-2.5`}>
                <h3 className={`${kicker} text-primary-strong`}>Ma réponse</h3>
                <p className="leading-relaxed">{project.response}</p>
              </div>
            ) : null}
            {project.interventions?.length ? (
              <div className={`${card} gap-2.5`}>
                <h3 className={`${kicker} text-muted-foreground`}>Prestations</h3>
                <ul className="flex flex-wrap gap-1.5 text-[0.8125rem]">
                  {project.interventions.map((item) => (
                    <li key={item} className="rounded-md bg-muted px-2.5 py-1.25">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {hasResults ? (
        <section aria-labelledby="resultats" className="flex flex-col gap-5 pt-12 pb-16 md:pb-26">
          <h2 id="resultats" className={h2}>
            {project.resultsTitle || 'Les résultats'}
          </h2>
          {project.metrics?.length ? (
            {/* auto-fit: 1 to 4 figures share the full width, wrapping when too narrow. */}
            <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(16.25rem,100%),1fr))] gap-4">
              {project.metrics.map((metric, index) => (
                <div
                  key={metric.id ?? metric.label}
                  className={`${card} flex-col-reverse justify-end gap-2 ${index === 0 ? 'border-primary bg-primary text-primary-foreground' : ''}`}
                >
                  <dt className="text-[0.9375rem]">{metric.label}</dt>
                  <dd
                    className={`font-heading leading-[1.2] font-bold ${metric.value.length > 8 ? 'text-2xl' : 'text-[2.5rem] leading-none'} ${index === 0 ? '' : 'text-primary'}`}
                  >
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          {project.results ? <RichText data={project.results} className={body} /> : null}
        </section>
      ) : null}

      {gallery.length ? (
        <section aria-labelledby="captures" className="flex flex-col gap-5 pb-16 md:pb-26">
          <h2 id="captures" className={h2}>
            {project.galleryTitle || 'Le résultat en images'}
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {gallery.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-xl bg-muted">
                <MediaImage
                  media={image}
                  sizes="(min-width: 768px) 580px, 100vw"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {steps.length ? (
        <section aria-labelledby="en-bref" className="flex flex-wrap gap-12 pb-16 md:pb-26">
          <div className="flex flex-[1_1_18.75rem] flex-col items-start gap-4">
            <h2 id="en-bref" className={h2Lg}>
              {project.stepsTitle || 'En bref : comment on y est arrivés'}
            </h2>
            {project.objectives ? (
              <p className="text-[1.0625rem] leading-[1.65] text-foreground-soft">{project.objectives}</p>
            ) : null}
            {hasDetail ? (
              <a href="#detail" className={linkClass}>
                Lire la démarche détaillée ↓
              </a>
            ) : null}
            {project.website?.url ? (
              <a href={project.website.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {project.website.label || 'Voir le site'} ↗<span className="sr-only"> (nouvel onglet)</span>
              </a>
            ) : null}
          </div>
          <ol className="flex min-w-0 flex-[999_1_37.5rem] flex-col">
            {steps.map((step) => (
              <li key={step.id ?? step.anchor} className="flex gap-5.5">
                <div aria-hidden="true" className="flex shrink-0 flex-col items-center">
                  <span className="flex size-11 items-center justify-center rounded-full border-2 border-primary bg-card font-heading text-[0.9375rem] font-semibold text-primary-strong">
                    {step.num}
                  </span>
                  <span className="min-h-5 w-0.5 flex-1 bg-accent" />
                </div>
                <div className="flex flex-col gap-1.5 pt-2 pb-7">
                  <h3 className="font-heading text-lg font-semibold">
                    <span className="sr-only">Étape {step.num} : </span>
                    {step.short}
                  </h3>
                  {step.summary ? (
                    <p className="leading-normal text-foreground-soft">{step.summary}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {hasDetail ? (
        <section
          id="detail"
          aria-labelledby="detail-titre"
          className="flex scroll-mt-6 flex-wrap gap-14 border-t pt-18 pb-16 md:pb-26"
        >
          <nav
            aria-label="Sommaire de la démarche"
            className="flex flex-[1_1_15rem] flex-col gap-2.5 self-start text-[0.9375rem] md:sticky md:top-6"
          >
            <span className={`${kicker} text-muted-foreground`}>Sommaire</span>
            <ul className="flex flex-col gap-2.5 font-semibold">
              {hasContext ? (
                <li>
                  <a href="#contexte" className="hover:text-primary-strong">
                    {project.contextTitle || 'Contexte & enjeux'}
                  </a>
                </li>
              ) : null}
              {steps.map((step) => (
                <li key={step.id ?? step.anchor}>
                  <a href={`#${step.anchor}`} className="flex gap-2.5 hover:text-primary-strong">
                    <span className="w-4.5 shrink-0 text-primary">{step.num}</span>
                    <span>{step.short}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex max-w-195 min-w-0 flex-[999_1_40rem] flex-col gap-14">
            <h2 id="detail-titre" className={h2Lg}>
              {project.approachTitle || 'La démarche en détail'}
            </h2>
            {hasContext ? (
              <section
                id="contexte"
                aria-labelledby="contexte-titre"
                className="flex scroll-mt-6 flex-col gap-4"
              >
                <h3 id="contexte-titre" className="font-heading text-[1.375rem] font-semibold">
                  {project.contextTitle || 'Contexte & enjeux'}
                </h3>
                {project.context ? <RichText data={project.context} className={body} /> : null}
                {project.constraints ? <RichText data={project.constraints} className={body} /> : null}
              </section>
            ) : null}
            {steps.map((step) => (
              <section
                key={step.id ?? step.anchor}
                id={step.anchor}
                aria-labelledby={`${step.anchor}-titre`}
                className="flex scroll-mt-6 flex-col gap-3.5"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-[0.9375rem] font-semibold text-primary-foreground"
                  >
                    {step.num}
                  </span>
                  <h3 id={`${step.anchor}-titre`} className="font-heading text-[1.3125rem] font-semibold">
                    <span className="sr-only">Étape {step.num} : </span>
                    {step.title}
                  </h3>
                </div>
                {step.content ? <RichText data={step.content} className={body} /> : null}
                {step.shots.map((image) => (
                  <MediaImage
                    key={image.id}
                    media={image}
                    sizes="(min-width: 1024px) 780px, 100vw"
                    className="w-full rounded-[1.125rem]"
                  />
                ))}
              </section>
            ))}
          </div>
        </section>
      ) : null}

      {nextSlot}

      {cta?.title ? (
        <section className="pb-4">
          <GlowCard
            as="div"
            className="flex flex-wrap items-center justify-between gap-8 rounded-[2rem] bg-primary px-7 py-12 text-primary-foreground [--glow-from:rgb(140_133_255/0.85)] [--glow-mid:rgb(120_112_250/0.35)] [--glow-size:520px] hover:shadow-[0_20px_44px_rgb(79_70_229/0.22)] md:px-12 md:py-18"
          >
            <div className="flex max-w-180 flex-col gap-2.5">
              <h2 className="font-heading text-[clamp(1.875rem,3.6vw,2.875rem)] leading-[1.08] font-bold tracking-[-0.02em]">
                {cta.title}
              </h2>
              {cta.text ? <p className="text-lg">{cta.text}</p> : null}
            </div>
            {cta.buttonLabel && cta.buttonHref ? (
              <Button
                asChild
                className="h-auto rounded-xl bg-ink px-6.5 py-4.5 text-base font-bold text-primary-foreground hover:bg-ink/85 focus-visible:ring-primary-foreground"
              >
                <Link href={cta.buttonHref}>{cta.buttonLabel} →</Link>
              </Button>
            ) : null}
          </GlowCard>
        </section>
      ) : null}
    </article>
  )
}
