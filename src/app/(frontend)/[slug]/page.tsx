import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PageView } from '@/components/models/page-view'
import { getPageIdBySlug } from '@/data/ids'
import { getPageMeta } from '@/data/pages'

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const id = await getPageIdBySlug((await params).slug)
  const meta = id ? await getPageMeta(id) : null
  return meta ?? {}
}

export default function Page({ params }: PageProps<'/[slug]'>) {
  return (
    <Suspense>
      <PageContent params={params} />
    </Suspense>
  )
}

async function PageContent({ params }: Pick<PageProps<'/[slug]'>, 'params'>) {
  const { slug } = await params
  const id = await getPageIdBySlug(slug)
  if (!id) notFound()
  return <PageView id={id} />
}
