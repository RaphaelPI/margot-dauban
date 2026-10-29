import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PageView } from '@/components/models/page-view'
import { getPageIdBySlug } from '@/data/pages'

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
