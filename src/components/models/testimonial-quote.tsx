import { cacheLife, cacheTag } from 'next/cache'
import { tagDocs, tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

export async function TestimonialQuote({ id }: { id: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('testimonials', id))
  const payload = await getPayload()
  const testimonial = await payload.findByID({
    collection: 'testimonials',
    id,
    depth: 1,
    disableErrors: true,
  })
  if (!testimonial) return null
  tagDocs('media', testimonial.photo)

  return (
    <figure className="flex flex-col gap-6">
      <blockquote className="font-heading text-2xl leading-snug md:text-3xl">
        « {testimonial.quote}
        {testimonial.highlight ? <span className="text-primary"> {testimonial.highlight}</span> : null} »
      </blockquote>
      <figcaption className="text-sm">
        <strong>{testimonial.authorName}</strong>
        {testimonial.authorRole || testimonial.company ? (
          <span className="text-muted-foreground">
            {' '}
            — {[testimonial.authorRole, testimonial.company].filter(Boolean).join(', ')}
          </span>
        ) : null}
      </figcaption>
    </figure>
  )
}
