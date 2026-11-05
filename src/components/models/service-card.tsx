import { cacheLife, cacheTag } from 'next/cache'
import { tagDocs, tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'
import { ServiceVisual } from './service-visual'

export async function ServiceCard({ id, short = false }: { id: string; short?: boolean }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('services', id))
  const payload = await getPayload()
  const service = await payload.findByID({ collection: 'services', id, depth: 1, disableErrors: true })
  if (!service) return null
  tagDocs('media', service.animation)
  const items = short && service.homeItems?.length ? service.homeItems : service.items

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-7.5">
      <ServiceVisual media={service.animation} className="-mt-1 -ml-2 size-28" />
      <h3 className="font-heading text-[1.1875rem] font-semibold">{service.title}</h3>
      {service.summary && !short ? <p className="text-foreground-soft">{service.summary}</p> : null}
      {items?.length ? (
        <ul className="flex flex-wrap content-start gap-2 text-base">
          {items.map((item) => (
            <li key={item} className="rounded-[0.625rem] bg-muted px-3.5 py-2">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
