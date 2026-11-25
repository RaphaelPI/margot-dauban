'use client'

import { type ReactNode, useState } from 'react'
import {
  filterCountClass,
  filterLinkClass,
  filterVariant,
  resetClass,
} from '@/components/models/project-filter-style'
import { SectorChips } from '@/components/sector-chips'
import { SlidingTabs } from '@/components/sliding-tabs'

type Item = { id: string; categoryIds: string[]; sector: string | null }

// Filters of the Témoignages page: project categories (the Projects page tabs) and sectors, combined.
// Cards are rendered on the server (`cards`, by id); filtering only hides the others. Two columns,
// cards of a row share its height (author and link aligned at the bottom).
export function TestimonialsBrowser({
  items,
  categories,
  sectors,
  cards,
  showSectors = true,
}: {
  items: Item[]
  categories: { id: string; title: string }[]
  sectors: string[]
  cards: Record<string, ReactNode>
  /** « Afficher les filtres par secteur » (Page Témoignages). */
  showSectors?: boolean
}) {
  const [category, setCategory] = useState<string | null>(null)
  const [sector, setSector] = useState<string | null>(null)
  const inCategory = (item: Item, id: string | null) => !id || item.categoryIds.includes(id)
  const inSector = (item: Item, name: string | null) => !name || item.sector === name
  // Sectors follow the chosen category: only those of its testimonials.
  const shownSectors = sectors.filter((name) =>
    items.some((item) => inCategory(item, category) && item.sector === name),
  )
  const pickCategory = (id: string | null) => {
    setCategory(id)
    if (sector && !items.some((item) => inCategory(item, id) && item.sector === sector)) setSector(null)
  }
  const shown = items.filter((item) => inCategory(item, category) && inSector(item, sector))
  const reset = () => {
    setCategory(null)
    setSector(null)
  }
  const countIn = (id: string | null) => items.filter((item) => inCategory(item, id)).length
  const countOf = (name: string | null) =>
    items.filter((item) => inCategory(item, category) && inSector(item, name)).length

  return (
    <>
      {categories.length || (showSectors && sectors.length) ? (
        <section aria-label="Filtrer les témoignages" className="flex flex-col gap-5.5 pb-10">
          {categories.length ? (
            <div
              className={`flex flex-wrap justify-between gap-4 ${filterVariant === 'underline' ? 'items-end border-b' : 'items-center'}`}
            >
              <SlidingTabs aria-label="Type de projet" variant={filterVariant}>
                {[{ id: null, title: 'Tous' }, ...categories].map((option) => (
                  <button
                    key={option.id ?? 'tous'}
                    type="button"
                    aria-pressed={category === option.id}
                    onClick={() => pickCategory(option.id)}
                    className={`${filterLinkClass} cursor-pointer aria-pressed:text-foreground`}
                  >
                    {option.title}
                    <span className={filterCountClass}>{countIn(option.id)}</span>
                  </button>
                ))}
              </SlidingTabs>
              <p
                aria-live="polite"
                className={`text-base text-muted-foreground ${filterVariant === 'underline' ? 'pb-4' : ''}`}
              >
                {shown.length} avis
              </p>
            </div>
          ) : null}
          {showSectors && (shownSectors.length || sector) ? (
            <SectorChips
              sectors={shownSectors}
              active={sector}
              onPick={setSector}
              countOf={countOf}
              onReset={category || sector ? reset : undefined}
            />
          ) : category ? (
            <button type="button" onClick={reset} className={`-mt-2 self-end ${resetClass}`}>
              Réinitialiser
            </button>
          ) : null}
        </section>
      ) : null}

      <section aria-label="Témoignages" className="pb-24">
        {shown.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {shown.map((item) => (
              <div
                key={item.id}
                className="flex animate-in fade-in-0 slide-in-from-bottom-3 duration-500 motion-reduce:animate-none"
              >
                {cards[item.id]}
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-[1.375rem] border border-dashed border-[#d9dae4] p-10 text-center text-base text-muted-foreground">
            {items.length ? (
              <>
                Aucun témoignage pour cette combinaison.{' '}
                <button type="button" onClick={reset} className={resetClass}>
                  Voir tous les avis
                </button>
              </>
            ) : (
              'Aucun témoignage publié pour le moment.'
            )}
          </p>
        )}
      </section>
    </>
  )
}
