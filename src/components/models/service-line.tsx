import { cacheLife, cacheTag } from 'next/cache'
import { tagDocs, tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { ServiceVisual } from './service-visual'

// One expertise on the Prestations page: visual and title, description, services as chips.
export async function ServiceLine({ id }: { id: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('services', id))
  const payload = await getPayload()
  const service = await payload.findByID({ collection: 'services', id, depth: 1, disableErrors: true })
  if (!service) return null
  tagDocs('media', service.animation)

  return (
    <article className="grid grid-cols-[repeat(auto-fit,minmax(min(18.75rem,100%),1fr))] gap-x-12 gap-y-6 border-t border-border py-10">
      <div className="flex flex-col gap-3">
        <ServiceVisual media={service.animation} className="size-30" />
        <h3 className="font-heading text-[1.75rem] leading-tight font-semibold text-primary">
          {service.title}
        </h3>
      </div>
      {service.summary ? (
        <p className="text-lg leading-[1.7] text-foreground-soft">{service.summary}</p>
      ) : (
        <span />
      )}
      {service.items?.length ? (
        <ul className="flex flex-wrap content-start gap-2 text-base">
          {service.items.map((item) => (
            <li key={item} className="rounded-[0.625rem] bg-muted px-3.5 py-2">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
