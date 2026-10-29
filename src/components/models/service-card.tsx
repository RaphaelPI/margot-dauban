import { cacheLife, cacheTag } from 'next/cache'
import { LottiePlayer } from '@/components/lottie-player'
import { tagDocs, tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

export async function ServiceCard({ id, short = false }: { id: string; short?: boolean }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('services', id))
  const payload = await getPayload()
  const service = await payload.findByID({ collection: 'services', id, depth: 1, disableErrors: true })
  if (!service) return null
  tagDocs('media', service.animation)
  const items = short && service.homeItems?.length ? service.homeItems : service.items
  const animation =
    typeof service.animation === 'object' && service.animation?.url ? service.animation.url : null

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-7.5">
      {animation ? <LottiePlayer src={animation} className="-mt-2 -ml-3 size-37.5" /> : null}
      <h3 className="font-heading text-[1.1875rem] font-semibold">{service.title}</h3>
      {service.summary && !short ? <p className="text-foreground-soft">{service.summary}</p> : null}
      <ul className="flex list-disc flex-col gap-2 pl-4.5 text-base text-foreground-soft">
        {items?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
