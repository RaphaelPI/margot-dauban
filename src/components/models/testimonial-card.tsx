import { cacheLife, cacheTag } from 'next/cache'
import { ArrowLink } from '@/components/arrow-link'
import { ExpandableQuote } from '@/components/expandable-quote'
import { RichTitle } from '@/components/rich-title'
import { tagDocs, tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { titleExcerpt, titleParagraphs } from '@/lib/rich-title'
import { MediaImage } from './media-image'

// Initials tiles when there is no logo (colours of the mockup), picked from the company name.
const tiles = [
  'bg-[#e7e6ff] text-[#3730a3]',
  'bg-[#e1eaf7] text-[#1e3a6e]',
  'bg-[#eceaf4] text-[#2e2a7a]',
  'bg-peach text-[#8a3b1e]',
  'bg-[#f2e6df] text-[#6b4a3c]',
  'bg-[#f6e9e2] text-[#8a3b1e]',
]
const tileFor = (name: string) =>
  tiles[[...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % tiles.length]
const initialsOf = (name: string) =>
  name
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

// Long quotes show their first 40 words, then « Voir plus » (as in the mockup).
const excerptWords = 40
const quoteLook = {
  paragraphClassName: 'block',
  // Bold stays bold here (no lilac highlight, unlike titles and the project page block).
  highlightClassName: 'font-bold',
}

// Indigo quotation marks glued to the first and last words (« … » excerpt: opening mark only).
const mark = 'font-heading text-[1.375em] leading-none font-bold text-primary'
const open = (
  <span aria-hidden="true" className={`${mark} mr-1.5`}>
    “
  </span>
)
const close = (
  <span aria-hidden="true" className={`${mark} ml-1.5`}>
    ”
  </span>
)

const tag = 'rounded-md px-2.5 py-1 text-sm font-bold'

// One testimonial of the Témoignages page: what's left empty comes from the linked project
// (categories, sector, image, company name). Long quotes fold (« Voir plus »).
export async function TestimonialCard({ id }: { id: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('testimonials', id))
  const payload = await getPayload()
  const testimonial = await payload.findByID({
    collection: 'testimonials',
    id,
    depth: 2,
    disableErrors: true,
  })
  if (!testimonial) return null
  const project =
    typeof testimonial.project === 'object' && testimonial.project?._status === 'published'
      ? testimonial.project
      : null
  if (project) cacheTag(tags.doc('projects', project.id))
  const categories = (
    testimonial.categories?.length ? testimonial.categories : (project?.categories ?? [])
  ).filter((category) => typeof category === 'object' && category)
  tagDocs('project-categories', categories)
  tagDocs('media', testimonial.logo, testimonial.image, project?.cover)
  const sector = testimonial.sector || project?.sector
  const company = testimonial.company || project?.title || ''
  const visual =
    testimonial.visual === 'custom'
      ? testimonial.image
      : testimonial.visual === 'project'
        ? project?.cover
        : null

  return (
    <article className="flex flex-1 flex-col gap-4 rounded-3xl border bg-card px-7.5 pt-6 pb-7.5">
      {visual && typeof visual === 'object' ? (
        <div className="overflow-hidden rounded-[0.875rem] bg-muted">
          <MediaImage
            media={visual}
            sizes="(min-width: 1024px) 580px, 100vw"
            className="aspect-[16/10] w-full object-cover"
          />
        </div>
      ) : null}
      {categories.length || sector ? (
        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) =>
            typeof category === 'object' ? (
              <span key={category.id} className={`${tag} bg-secondary`}>
                {category.title}
              </span>
            ) : null,
          )}
          {sector ? <span className={`${tag} bg-tag-warm text-tag-warm-foreground`}>{sector}</span> : null}
        </div>
      ) : null}
      <blockquote className="text-[1.0625rem] leading-[1.7]">
        <ExpandableQuote
          excerpt={
            titleExcerpt(titleParagraphs(testimonial.quote), excerptWords).cut ? (
              <RichTitle value={testimonial.quote} maxWords={excerptWords} before={open} {...quoteLook} />
            ) : undefined
          }
          full={<RichTitle value={testimonial.quote} before={open} after={close} {...quoteLook} />}
        />
      </blockquote>
      <footer className="mt-auto flex items-center gap-3 border-t border-[#ececf2] pt-4">
        {testimonial.logo && typeof testimonial.logo === 'object' ? (
          <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-card">
            <MediaImage media={testimonial.logo} sizes="44px" className="size-full object-contain p-1" />
          </span>
        ) : company ? (
          <span
            aria-hidden="true"
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl font-heading text-sm font-bold ${tileFor(company)}`}
          >
            {initialsOf(company)}
          </span>
        ) : null}
        <span className="flex flex-1 flex-col">
          <strong>{testimonial.author}</strong>
          {testimonial.role || company ? (
            <span className="text-base text-muted-foreground">
              {[testimonial.role, company].filter(Boolean).join(' · ')}
            </span>
          ) : null}
        </span>
      </footer>
      {project?.slug ? (
        <ArrowLink href={`/projets/${project.slug}`} className="self-start text-[1.0625rem]!">
          Voir le use case
        </ArrowLink>
      ) : null}
    </article>
  )
}
