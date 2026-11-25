import Link from 'next/link'
import { CtaLink } from '@/components/cta-link'
import { GlowCard } from '@/components/glow-card'
import { ProjectCard } from '@/components/models/project-card'
import { ProjectCategoryFilter } from '@/components/models/project-category-filter'
import { filterCountClass, filterLinkClass, filterVariant } from '@/components/models/project-filter-style'
import { ProjectsGrid } from '@/components/projects-grid'
import { RichTextOrPlain } from '@/components/rich-text-or-plain'
import { RichTitle } from '@/components/rich-title'
import { SlidingTabs } from '@/components/sliding-tabs'
import { getProjectCategoryIds, getProjectIds, getProjectIdsInCategory } from '@/data/ids'
import { getProjectSectors } from '@/data/project-sectors'
import { getProjectsPage } from '@/data/settings'
import { isSafeHref } from '@/lib/safe-href'

// Body of the Projects page (designs/11-page-projets): all projects (`/projets`) or one category
// (`/projets/categorie/<slug>`). One static page per category, so a filtered list can be shared;
// the optional sector chips filter on the page.
export async function ProjectsListing({ categoryId = null }: { categoryId?: string | null }) {
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

      <ProjectList categoryId={categoryId} showSectors={page.showSectorFilters !== false} />

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

async function ProjectList({ categoryId, showSectors }: { categoryId: string | null; showSectors: boolean }) {
  const [allIds, categoryIds, ids, sectors] = await Promise.all([
    getProjectIds(),
    getProjectCategoryIds(),
    categoryId ? getProjectIdsInCategory(categoryId) : getProjectIds(),
    getProjectSectors(),
  ])

  return (
    <ProjectsGrid
      showSectors={showSectors}
      items={ids.map((id) => ({ id, sector: sectors[id] ?? null }))}
      cards={Object.fromEntries(ids.map((id) => [id, <ProjectCard key={id} id={id} />]))}
      tabs={
        categoryIds.length ? (
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
        ) : null
      }
    />
  )
}
