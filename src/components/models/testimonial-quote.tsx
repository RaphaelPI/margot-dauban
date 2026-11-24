import { cacheLife, cacheTag } from 'next/cache'
import { Testimonial } from '@/components/testimonial'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { isPreview } from '@/lib/preview'
import { titlePlain } from '@/lib/rich-title'

const idOf = (value: unknown) =>
  value && typeof value === 'object' && 'id' in value ? String(value.id) : value ? String(value) : null

// A testimonial from the « Témoignages » list as the quote block of its project's page. The
// project's own testimonial block, when filled, replaces its fields (another extract on that page).
export async function TestimonialQuote({ id, projectId }: { id: string; projectId: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('testimonials', id), tags.doc('projects', projectId))
  const payload = await getPayload()
  const draft = await isPreview()
  const [testimonial, project] = await Promise.all([
    payload.findByID({ collection: 'testimonials', id, depth: 0, disableErrors: true, draft }),
    payload.findByID({
      collection: 'projects',
      id: projectId,
      depth: 0,
      disableErrors: true,
      draft,
      select: { title: true, testimonial: true },
    }),
  ])
  if (!testimonial) return null
  const override = project?.testimonial
  const fallbackCompany = project?.title

  return (
    <Testimonial
      compact
      quote={titlePlain(override?.quote) ? override?.quote : testimonial.quote}
      author={override?.author || testimonial.author}
      role={override?.role || testimonial.role}
      company={override?.company || testimonial.company || fallbackCompany}
      photoId={idOf(override?.photo) ?? idOf(testimonial.photo)}
    />
  )
}
