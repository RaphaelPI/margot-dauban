// Projects page filters. Two looks from designs/11-page-projets/filtres-4-propositions.html:
// - 'pill': A, one white container, an indigo pill slides under the current tab;
// - 'underline': B, editorial tabs (Unbounded), an indigo underline slides under the current tab.
// Switch here; SlidingTabs, the tabs and the count follow.
export type FilterVariant = 'pill' | 'underline'
export const filterVariant: FilterVariant = 'underline'

const looks = {
  pill: {
    link: 'group relative z-10 inline-flex min-h-11 items-center gap-2 rounded-full px-4.5 py-2.75 text-base font-bold whitespace-nowrap transition-colors duration-300 hover:text-primary-strong aria-[current=page]:text-primary-foreground aria-[current=page]:hover:text-primary-foreground',
    count:
      'rounded-full bg-muted px-2 text-base font-bold text-muted-foreground transition-colors duration-300 group-aria-[current=page]:bg-white/20 group-aria-[current=page]:text-primary-foreground',
  },
  underline: {
    link: 'relative inline-flex min-h-11 items-start pt-3.5 pb-4.5 font-heading text-[1.0625rem] font-semibold whitespace-nowrap text-muted-foreground transition-colors duration-300 hover:text-foreground aria-[current=page]:text-foreground',
    count: 'relative -top-1.5 ml-1 font-sans text-base font-bold text-primary',
  },
} satisfies Record<FilterVariant, { link: string; count: string }>

export const filterLinkClass = looks[filterVariant].link
export const filterCountClass = looks[filterVariant].count
