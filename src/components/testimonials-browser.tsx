'use client'

import { type ReactNode, useState } from 'react'
import { filterCountClass, filterLinkClass, filterVariant } from '@/components/models/project-filter-style'
import { SlidingTabs } from '@/components/sliding-tabs'

type Item = { id: string; categoryIds: string[]; sector: string | null }

const chip =
  'inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#d9dae4] bg-card px-3.5 py-2 text-sm font-bold transition-colors hover:border-[#a9a6c9] aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
const chipCount =
  'rounded-full bg-muted px-1.5 text-sm text-muted-foreground group-aria-pressed:bg-white/20 group-aria-pressed:text-primary-foreground'
const resetClass = 'font-bold text-primary-strong underline underline-offset-4 hover:text-primary'

// Filters of the Témoignages page: project categories (the Projects page tabs) and sectors, combined.
// Cards are rendered on the server (`cards`, by id); filtering only hides the others.
export function TestimonialsBrowser({
  items,
  categories,
  sectors,
  cards,
}: {
  items: Item[]
  categories: { id: string; title: string }[]
  sectors: string[]
  cards: Record<string, ReactNode>
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
      {categories.length || sectors.length ? (
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
          {shownSectors.length || sector ? (
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="min-w-30 text-sm font-bold tracking-[0.08em] text-muted-foreground uppercase">
                Secteur
              </span>
              {[null, ...shownSectors].map((name) => (
                <button
                  key={name ?? 'tous'}
                  type="button"
                  aria-pressed={sector === name}
                  onClick={() => setSector(name)}
                  className={`group ${chip}`}
                >
                  {name ?? 'Tous secteurs'}
                  <span className={chipCount}>{countOf(name)}</span>
                </button>
              ))}
            </div>
          ) : null}
          {category || sector ? (
            <button type="button" onClick={reset} className={`-mt-2 self-end ${resetClass}`}>
              Réinitialiser
            </button>
          ) : null}
        </section>
      ) : null}

      <section aria-label="Témoignages" className="pb-24">
        {shown.length ? (
          <div className="columns-[2_26rem] gap-6">
            {shown.map((item) => (
              <div
                key={item.id}
                className="animate-in break-inside-avoid fade-in-0 slide-in-from-bottom-3 duration-500 motion-reduce:animate-none"
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
