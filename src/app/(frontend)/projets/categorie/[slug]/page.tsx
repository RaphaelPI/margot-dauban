import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectsListing } from '@/components/projects-listing'
import { getProjectCategoryIdBySlug, getProjectCategorySlugs } from '@/data/ids'
import { getProjectCategoryTitle } from '@/data/project-categories'
import { getProjectsPage } from '@/data/settings'
import { titlePlain } from '@/lib/rich-title'

// Projects page filtered by one category: every category is prerendered (same pattern as
// /projets/[slug]). `_` placeholder when there is no category yet (renders the 404).
export async function generateStaticParams() {
  const slugs = await getProjectCategorySlugs()
  return slugs.length ? slugs : [{ slug: '_' }]
}

export async function generateMetadata({
  params,
}: PageProps<'/projets/categorie/[slug]'>): Promise<Metadata> {
  const id = await getProjectCategoryIdBySlug((await params).slug)
  if (!id) return {}
  const [page, category] = await Promise.all([getProjectsPage(), getProjectCategoryTitle(id)])
  const title = page.seo?.title ?? titlePlain(page.title)
  return {
    title: category ? `${title} · ${category}` : title,
    description: page.seo?.description ?? undefined,
  }
}

export default async function ProjectCategoryPage({ params }: PageProps<'/projets/categorie/[slug]'>) {
  const id = await getProjectCategoryIdBySlug((await params).slug)
  if (!id) notFound()
  return <ProjectsListing categoryId={id} />
}
