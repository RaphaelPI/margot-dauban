import { cacheLife, cacheTag } from 'next/cache'
import { Testimonial } from '@/components/testimonial'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

const idOf = (value: unknown) =>
  value && typeof value === 'object' && 'id' in value ? String(value.id) : value ? String(value) : null

// A testimonial from the « Témoignages » list as the quote block of its project's page.
export async function TestimonialQuote({
  id,
  fallbackCompany,
}: {
  id: string
  fallbackCompany?: string | null
}) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('testimonials', id))
  const payload = await getPayload()
  const testimonial = await payload.findByID({
    collection: 'testimonials',
    id,
    depth: 0,
    disableErrors: true,
  })
  if (!testimonial) return null

  return (
    <Testimonial
      compact
      quote={testimonial.quote}
      author={testimonial.author}
      role={testimonial.role}
      company={testimonial.company || fallbackCompany}
      photoId={idOf(testimonial.photo)}
    />
  )
}
