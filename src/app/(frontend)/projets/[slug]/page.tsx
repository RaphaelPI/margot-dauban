import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProjectNextCard } from '@/components/models/project-next-card'
import { ProjectView } from '@/components/models/project-view'
import { getNextProjectId, getProjectIdBySlug } from '@/data/ids'

export default function ProjectPage({ params }: PageProps<'/projets/[slug]'>) {
  return (
    <>
      {/* Indigo & peach glow behind the header and title (body is the positioned ancestor). */}
      <div aria-hidden="true" className="bg-hero absolute inset-x-0 top-0 -z-10 h-[1000px]" />
      <Suspense>
        <Project params={params} />
      </Suspense>
    </>
  )
}

async function Project({ params }: Pick<PageProps<'/projets/[slug]'>, 'params'>) {
  const { slug } = await params
  const id = await getProjectIdBySlug(slug)
  if (!id) notFound()
  const nextId = await getNextProjectId(id)
  return <ProjectView id={id} nextSlot={nextId ? <ProjectNextCard id={nextId} /> : null} />
}
