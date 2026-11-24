'use client'

import { usePathname } from 'next/navigation'

// Leaves draft preview on the current page (the banner only exists while previewing).
export function PreviewExit() {
  const path = usePathname()
  return (
    <a
      href={`/apercu/fin?chemin=${encodeURIComponent(path)}`}
      className="rounded-full bg-white/15 px-4 py-1.5 font-semibold text-white transition-colors hover:bg-white/25 focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none"
    >
      Quitter l’aperçu
    </a>
  )
}
