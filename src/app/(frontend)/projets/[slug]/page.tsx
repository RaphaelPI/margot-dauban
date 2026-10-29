import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProjectView } from '@/components/models/project-view'
import { getProjectIdBySlug } from '@/data/ids'

export default function ProjectPage({ params }: PageProps<'/projets/[slug]'>) {
  return (
    <Suspense>
      <Project params={params} />
    </Suspense>
  )
}

async function Project({ params }: Pick<PageProps<'/projets/[slug]'>, 'params'>) {
  const { slug } = await params
  const id = await getProjectIdBySlug(slug)
  if (!id) notFound()
  return <ProjectView id={id} />
}
