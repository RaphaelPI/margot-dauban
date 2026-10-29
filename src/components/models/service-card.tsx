import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

export async function ServiceCard({ id, short = false }: { id: string; short?: boolean }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('services', id))
  const payload = await getPayload()
  const service = await payload.findByID({ collection: 'services', id, depth: 0, disableErrors: true })
  if (!service) return null
  const items = short && service.homeItems?.length ? service.homeItems : service.items

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-heading text-xl font-semibold">{service.title}</h3>
      {service.summary && !short ? <p className="text-muted-foreground">{service.summary}</p> : null}
      <ul className="flex flex-col gap-1 text-muted-foreground">
        {items?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
