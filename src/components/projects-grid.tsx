'use client'

import { type ReactNode, useState } from 'react'
import { filterVariant } from '@/components/models/project-filter-style'
import { SectorChips } from '@/components/sector-chips'

type Item = { id: string; sector: string | null }

// Projects page body below the title: the category tabs (`tabs`, links rendered on the server),
// the count, the optional sector chips (filtering on the page) and the cards (`cards`, by id).
export function ProjectsGrid({
  tabs,
  items,
  cards,
  showSectors,
}: {
  tabs: ReactNode
  items: Item[]
  cards: Record<string, ReactNode>
  /** « Afficher les filtres par secteur » (Page Projets). */
  showSectors: boolean
}) {
  const [sector, setSector] = useState<string | null>(null)
  const sectors = [...new Set(items.flatMap((item) => (item.sector ? [item.sector] : [])))].sort((a, b) =>
    a.localeCompare(b, 'fr'),
  )
  const active = showSectors && sector && sectors.includes(sector) ? sector : null
  const shown = active ? items.filter((item) => item.sector === active) : items
  const countOf = (name: string | null) =>
    name ? items.filter((item) => item.sector === name).length : items.length

  return (
    <>
      {tabs || (showSectors && sectors.length) ? (
        <section aria-label="Filtrer les projets" className="mb-8 flex flex-col gap-5.5 pt-2">
          {tabs ? (
            <div
              className={`flex flex-wrap justify-between gap-4 ${filterVariant === 'underline' ? 'items-end border-b' : 'items-center'}`}
            >
              {tabs}
              <p
                aria-live="polite"
                className={`text-base text-muted-foreground ${filterVariant === 'underline' ? 'pb-4' : ''}`}
              >
                {shown.length} projet{shown.length > 1 ? 's' : ''}
              </p>
            </div>
          ) : null}
          {showSectors && sectors.length ? (
            <SectorChips
              sectors={sectors}
              active={active}
              onPick={setSector}
              countOf={countOf}
              onReset={active ? () => setSector(null) : undefined}
            />
          ) : null}
        </section>
      ) : null}

      <section aria-labelledby="liste-projets" className="pb-24">
        <h2 id="liste-projets" className="sr-only">
          Liste des projets
        </h2>
        {shown.length ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(21.25rem,100%),1fr))] gap-5">
            {shown.map((item) => (
              <div
                key={item.id}
                className="grid animate-in fade-in-0 duration-300 motion-reduce:animate-none"
              >
                {cards[item.id]}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Aucun projet publié pour le moment.</p>
        )}
      </section>
    </>
  )
}
