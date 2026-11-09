import { notFound } from 'next/navigation'
import { ProjectNextCard } from '@/components/models/project-next-card'
import { ProjectView } from '@/components/models/project-view'
import { getNextProjectId, getProjectIdBySlug, getProjectSlugs } from '@/data/ids'

// Every published project is prerendered: the full HTML is served from the cache, no streaming.
// A slug published after the build renders once on its first visit, then is cached too.
// Cache Components needs at least one param: an unknown placeholder renders the 404.
export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.length ? slugs : [{ slug: '_' }]
}

export default async function ProjectPage({ params }: PageProps<'/projets/[slug]'>) {
  const { slug } = await params
  const id = await getProjectIdBySlug(slug)
  if (!id) notFound()
  const nextId = await getNextProjectId(id)
  return (
    <>
      {/* Indigo & peach glow behind the header and title (body is the positioned ancestor). */}
      <div aria-hidden="true" className="bg-hero absolute inset-x-0 top-0 -z-10 h-[1000px]" />
      <ProjectView id={id} nextSlot={nextId ? <ProjectNextCard id={nextId} /> : null} />
    </>
  )
}
