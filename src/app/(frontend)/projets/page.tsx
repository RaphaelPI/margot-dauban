import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { CtaLink } from '@/components/cta-link'
import { GlowCard } from '@/components/glow-card'
import { ProjectCard } from '@/components/models/project-card'
import { ProjectCategoryFilter } from '@/components/models/project-category-filter'
import { filterCountClass, filterLinkClass, filterVariant } from '@/components/models/project-filter-style'
import { RichTextOrPlain } from '@/components/rich-text-or-plain'
import { RichTitle } from '@/components/rich-title'
import { SlidingTabs } from '@/components/sliding-tabs'
import {
  getProjectCategoryIdBySlug,
  getProjectCategoryIds,
  getProjectIds,
  getProjectIdsInCategory,
} from '@/data/ids'
import { getProjectsPage } from '@/data/settings'
import { titlePlain } from '@/lib/rich-title'
import { isSafeHref } from '@/lib/safe-href'

// Page « Projets » (designs/11-page-projets): all projects, filtered by category through
// `?categorie=<slug>` so a filtered list can be shared.

export async function generateMetadata(): Promise<Metadata> {
  const page = await getProjectsPage()
  return {
    title: page.seo?.title ?? titlePlain(page.title),
    description: page.seo?.description ?? undefined,
  }
}

export default async function ProjectsPage({ searchParams }: PageProps<'/projets'>) {
  const page = await getProjectsPage()
  const cta = page.cta

  return (
    <>
      {/* Indigo & peach glow behind the header and title (body is the positioned ancestor). */}
      <div aria-hidden="true" className="bg-hero absolute inset-x-0 top-0 -z-10 h-[1000px]" />

      <header className="flex max-w-205 flex-col gap-5 pt-12 pb-10 md:pt-18">
        <h1 className="font-heading text-[clamp(2rem,4vw,3.25rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance">
          <RichTitle value={page.title} />
        </h1>
        {page.intro ? (
          <RichTextOrPlain
            value={page.intro}
            className="max-w-160 text-[1.1875rem] leading-[1.55] text-foreground-soft"
          />
        ) : null}
      </header>

      <Suspense fallback={<ProjectList />}>
        <FilteredProjectList searchParams={searchParams} />
      </Suspense>

      {cta?.title ? (
        <section className="pb-4">
          <GlowCard
            data-cta-band=""
            as="div"
            className="flex flex-wrap items-center justify-between gap-8 rounded-[2rem] bg-primary px-7 py-12 text-primary-foreground [--glow-from:rgb(140_133_255/0.45)] [--glow-mid:rgb(120_112_250/0.15)] [--glow-size:520px] hover:shadow-[0_16px_36px_rgb(79_70_229/0.12)] md:px-12 md:py-18"
          >
            <div className="flex max-w-180 flex-col gap-2.5">
              <h2 className="font-heading text-[clamp(1.875rem,3.6vw,2.875rem)] leading-[1.08] font-bold tracking-[-0.02em]">
                {cta.title}
              </h2>
              {cta.text ? <RichTextOrPlain value={cta.text} className="text-lg" /> : null}
            </div>
            {cta.buttonLabel && cta.buttonHref && isSafeHref(cta.buttonHref) ? (
              <CtaLink href={cta.buttonHref} tone="black">
                {cta.buttonLabel}
              </CtaLink>
            ) : null}
          </GlowCard>
        </section>
      ) : null}
    </>
  )
}

// Reads the filter from the URL (runtime data), inside the Suspense boundary.
async function FilteredProjectList({ searchParams }: Pick<PageProps<'/projets'>, 'searchParams'>) {
  const { categorie } = await searchParams
  const slug = typeof categorie === 'string' ? categorie : null
  const categoryId = slug ? await getProjectCategoryIdBySlug(slug) : null
  return <ProjectList categoryId={categoryId} />
}

async function ProjectList({ categoryId = null }: { categoryId?: string | null }) {
  const [allIds, categoryIds, ids] = await Promise.all([
    getProjectIds(),
    getProjectCategoryIds(),
    categoryId ? getProjectIdsInCategory(categoryId) : getProjectIds(),
  ])

  return (
    <>
      {categoryIds.length ? (
        <section
          aria-label="Filtrer les projets"
          className={`mb-8 flex flex-wrap justify-between gap-4 pt-2 ${filterVariant === 'underline' ? 'items-end border-b' : 'items-center'}`}
        >
          <SlidingTabs aria-label="Catégories de projets" variant={filterVariant}>
            <Link
              href="/projets"
              scroll={false}
              aria-current={categoryId ? undefined : 'page'}
              className={filterLinkClass}
            >
              Tous
              <span className={filterCountClass}>{allIds.length}</span>
            </Link>
            {categoryIds.map((id) => (
              <ProjectCategoryFilter key={id} id={id} active={id === categoryId} />
            ))}
          </SlidingTabs>
          <p
            aria-live="polite"
            className={`text-base text-muted-foreground ${filterVariant === 'underline' ? 'pb-4' : ''}`}
          >
            {ids.length} projet{ids.length > 1 ? 's' : ''}
          </p>
        </section>
      ) : null}

      <section aria-labelledby="liste-projets" className="pb-24">
        <h2 id="liste-projets" className="sr-only">
          Liste des projets
        </h2>
        {ids.length ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(21.25rem,100%),1fr))] gap-5">
            {ids.map((id) => (
              <ProjectCard key={id} id={id} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Aucun projet publié pour le moment.</p>
        )}
      </section>
    </>
  )
}
