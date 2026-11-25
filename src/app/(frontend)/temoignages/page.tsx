import type { Metadata } from 'next'
import { TestimonialCard } from '@/components/models/testimonial-card'
import { RichTextOrPlain } from '@/components/rich-text-or-plain'
import { RichTitle } from '@/components/rich-title'
import { TestimonialsBrowser } from '@/components/testimonials-browser'
import { getTestimonialsPage } from '@/data/settings'
import { getTestimonialFilters } from '@/data/testimonials'
import { titlePlain } from '@/lib/rich-title'

// Page « Témoignages » (designs/89-page-temoignages): every published testimonial in a two-column
// grid, filtered by project category and sector. Avis: « Témoignages » collection; texts: « Page Témoignages ».

export async function generateMetadata(): Promise<Metadata> {
  const page = await getTestimonialsPage()
  return {
    title: page.seo?.title ?? (titlePlain(page.title) || 'Témoignages'),
    description: page.seo?.description ?? undefined,
  }
}

export default async function TestimonialsPageView() {
  const [page, { items, categories, sectors }] = await Promise.all([
    getTestimonialsPage(),
    getTestimonialFilters(),
  ])
  const cards = Object.fromEntries(
    items.map((item) => [item.id, <TestimonialCard key={item.id} id={item.id} />]),
  )

  return (
    <>
      {/* Indigo & peach glow behind the header and title (body is the positioned ancestor). */}
      <div aria-hidden="true" className="bg-hero absolute inset-x-0 top-0 -z-10 h-[1000px]" />

      <header className="flex max-w-205 flex-col gap-4.5 pt-12 pb-9 md:pt-18">
        <h1 className="font-heading text-[clamp(2rem,4vw,3.125rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance">
          <RichTitle value={page.title} />
        </h1>
        {page.intro ? (
          <RichTextOrPlain
            value={page.intro}
            className="text-[1.1875rem] leading-[1.55] text-foreground-soft"
          />
        ) : null}
      </header>

      <TestimonialsBrowser
        items={items}
        categories={categories}
        sectors={sectors}
        cards={cards}
        showSectors={page.showSectorFilters !== false}
      />
    </>
  )
}
