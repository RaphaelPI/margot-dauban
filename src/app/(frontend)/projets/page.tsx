import type { Metadata } from 'next'
import { ProjectsListing } from '@/components/projects-listing'
import { getProjectsPage } from '@/data/settings'
import { titlePlain } from '@/lib/rich-title'

// Page « Projets »: every project. Filters are static pages at /projets/categorie/<slug>.

export async function generateMetadata(): Promise<Metadata> {
  const page = await getProjectsPage()
  return {
    title: page.seo?.title ?? titlePlain(page.title),
    description: page.seo?.description ?? undefined,
  }
}

export default function ProjectsPage() {
  return <ProjectsListing />
}
