import { RichText } from '@payloadcms/richtext-lexical/react'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

export async function PageView({ id }: { id: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('pages', id))
  const payload = await getPayload()
  const page = await payload.findByID({ collection: 'pages', id, depth: 1, disableErrors: true })
  if (!page) return null

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-8">
      <h1 className="font-heading text-4xl font-semibold tracking-tight">{page.title}</h1>
      {page.content ? <RichText data={page.content} className="prose max-w-none" /> : null}
    </article>
  )
}
