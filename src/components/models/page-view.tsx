import { RichText } from '@payloadcms/richtext-lexical/react'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

// Text page of the « Pages » collection (mentions légales, confidentialité…): title and formatted
// rich text in the site's style.
const prose =
  'text-[1.0625rem] leading-[1.75] text-foreground-soft [&_*+*]:mt-4 [&_a]:font-semibold [&_a]:text-primary-strong [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-4 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h4]:mt-6 [&_h4]:font-bold [&_h4]:text-foreground [&_hr]:my-10 [&_li+li]:mt-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-bold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-6'

export async function PageView({ id }: { id: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('pages', id))
  const payload = await getPayload()
  const page = await payload.findByID({ collection: 'pages', id, depth: 1, disableErrors: true })
  if (!page) return null

  return (
    <>
      {/* Indigo & peach glow behind the header and title (body is the positioned ancestor). */}
      <div aria-hidden="true" className="bg-hero absolute inset-x-0 top-0 -z-10 h-[700px]" />
      <article className="mx-auto flex max-w-3xl flex-col gap-8 pt-12 pb-16 md:pt-16 md:pb-24">
        <h1 className="font-heading text-[clamp(2rem,4vw,3rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance">
          {page.title}
        </h1>
        {page.content ? <RichText data={page.content} className={prose} /> : null}
      </article>
    </>
  )
}
