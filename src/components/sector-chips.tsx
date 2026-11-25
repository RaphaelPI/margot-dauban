'use client'

import {
  chipClass,
  chipCountClass,
  chipLabelClass,
  resetClass,
} from '@/components/models/project-filter-style'

// Sector chips (Projets and Témoignages pages). Desktop: one wrapping line. Phone: « Secteur »,
// « Tous secteurs » and « Réinitialiser » on a first line, the sectors scrolling sideways below
// (like the category tabs).
export function SectorChips({
  sectors,
  active,
  onPick,
  countOf,
  onReset,
}: {
  sectors: string[]
  active: string | null
  onPick: (name: string | null) => void
  countOf: (name: string | null) => number
  /** Shown while a filter is on. */
  onReset?: () => void
}) {
  const chip = (name: string | null) => (
    <button
      key={name ?? 'tous'}
      type="button"
      aria-pressed={active === name}
      onClick={() => onPick(name)}
      className={`${chipClass} shrink-0`}
    >
      {name ?? 'Tous secteurs'}
      <span className={chipCountClass}>{countOf(name)}</span>
    </button>
  )

  return (
    <div className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:items-center">
      <div className="flex items-center gap-3 md:contents">
        <span className={`${chipLabelClass} md:mr-2`}>Secteur</span>
        {chip(null)}
        {onReset ? (
          <button type="button" onClick={onReset} className={`ml-auto md:order-last ${resetClass}`}>
            Réinitialiser
          </button>
        ) : null}
      </div>
      <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:contents [&::-webkit-scrollbar]:hidden">
        {sectors.map(chip)}
      </div>
    </div>
  )
}
