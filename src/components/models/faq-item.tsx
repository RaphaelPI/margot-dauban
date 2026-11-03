import { RichText } from '@payloadcms/richtext-lexical/react'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

// One question of the FAQ page, its answer always visible.
export async function FaqItem({ id }: { id: string }) {
  'use cache'
  cacheLife('model')
  cacheTag(tags.doc('faqs', id))
  const payload = await getPayload()
  const faq = await payload.findByID({ collection: 'faqs', id, depth: 0, disableErrors: true })
  if (!faq) return null

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[1.1875rem] leading-[1.35] font-bold">{faq.question}</h3>
      <RichText
        data={faq.answer}
        className="text-[1.0625rem] leading-[1.7] text-foreground-soft [&_*+*]:mt-3 [&_a]:font-bold [&_a]:underline [&_a]:underline-offset-4 [&_li+li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-6"
      />
    </div>
  )
}
