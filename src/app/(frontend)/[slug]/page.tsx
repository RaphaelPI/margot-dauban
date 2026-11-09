import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageView } from '@/components/models/page-view'
import { getPageIdBySlug, getPageSlugs } from '@/data/ids'
import { getPageMeta } from '@/data/pages'

// Every published text page is prerendered (same pattern as /projets/[slug]).
export async function generateStaticParams() {
  const slugs = await getPageSlugs()
  return slugs.length ? slugs : [{ slug: '_' }]
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const id = await getPageIdBySlug((await params).slug)
  const meta = id ? await getPageMeta(id) : null
  return meta ?? {}
}

export default async function Page({ params }: PageProps<'/[slug]'>) {
  const id = await getPageIdBySlug((await params).slug)
  if (!id) notFound()
  return <PageView id={id} />
}
