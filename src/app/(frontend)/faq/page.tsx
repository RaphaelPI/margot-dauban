import type { Metadata } from 'next'
import Link from 'next/link'
import { faqCategories } from '@/collections/Faqs'
import { GlowCard } from '@/components/glow-card'
import { FaqItem } from '@/components/models/faq-item'
import { RichTextOrPlain } from '@/components/rich-text-or-plain'
import { Button } from '@/components/ui/button'
import { getFaqIdsInCategory } from '@/data/ids'
import { getFaqPage } from '@/data/settings'
import { isSafeHref } from '@/lib/safe-href'

// Page « FAQ » (designs/15-page-faq, without the « most read » box): one block per theme,
// numbered, every answer visible. Questions come from the `faqs` collection (theme + admin order).

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFaqPage()
  return {
    title: page.seo?.title ?? 'FAQ',
    description: page.seo?.description ?? page.intro ?? undefined,
  }
}

// « & » in the title is set in indigo, as in the mockup.
const accentAmpersands = (title: string) =>
  title.split('&').flatMap((part, index) =>
    index === 0
      ? [part]
      : [
          // biome-ignore lint/suspicious/noArrayIndexKey: static pieces of one title, never reordered
          <span key={index} className="text-primary">
            &amp;
          </span>,
          part,
        ],
  )

export default async function FaqPageView() {
  const page = await getFaqPage()
  const themes = (
    await Promise.all(
      faqCategories.map(async (theme) => ({ ...theme, ids: await getFaqIdsInCategory(theme.value) })),
    )
  ).filter((theme) => theme.ids.length > 0)
  const cta = page.cta

  return (
    <>
      {/* Indigo & peach glow behind the header and title (body is the positioned ancestor). */}
      <div aria-hidden="true" className="bg-hero absolute inset-x-0 top-0 -z-10 h-[1000px]" />

      <header className="flex max-w-215 flex-col gap-4.5 pt-12 pb-14 md:pt-18">
        {page.eyebrow ? (
          <span className="text-base font-bold tracking-[0.08em] text-primary uppercase">{page.eyebrow}</span>
        ) : null}
        <h1 className="font-heading text-[clamp(2.125rem,4.6vw,3.75rem)] leading-[1.04] font-bold tracking-[-0.03em] text-balance">
          {accentAmpersands(page.title)}
        </h1>
        {page.intro ? (
          <p className="max-w-140 text-[1.1875rem] leading-[1.55] text-foreground-soft">{page.intro}</p>
        ) : null}
      </header>

      {themes.length ? (
        <div className="flex flex-col pb-18">
          {themes.map((theme, index) => (
            <section
              key={theme.value}
              id={theme.value}
              aria-labelledby={`${theme.value}-titre`}
              className="flex scroll-mt-6 md:scroll-mt-[calc(var(--header-h,7rem)+1.5rem)] flex-wrap gap-x-16 gap-y-8 border-t border-[#dcdce5] py-12"
            >
              {/* Number and theme stay in view while its questions scroll (wide screens, side by side). */}
              <div className="flex flex-[1_1_16.25rem] flex-col gap-2.5 self-start md:sticky md:top-[calc(var(--header-h,7rem)+1.5rem)]">
                <span
                  aria-hidden="true"
                  className="font-heading text-[2.75rem] leading-none font-bold text-[#dad8fa]"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 id={`${theme.value}-titre`} className="font-heading text-2xl leading-tight font-semibold">
                  {theme.label}
                </h2>
              </div>
              <div className="flex min-w-0 flex-[999_1_35rem] flex-col gap-7">
                {theme.ids.map((id) => (
                  <FaqItem key={id} id={id} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="pb-18 text-muted-foreground">Aucune question pour le moment.</p>
      )}

      {cta?.title ? (
        <section className="pb-4">
          <GlowCard
            as="div"
            className="flex flex-wrap items-center justify-between gap-8 rounded-[2rem] bg-primary px-7 py-12 text-primary-foreground [--glow-from:rgb(140_133_255/0.85)] [--glow-mid:rgb(120_112_250/0.35)] [--glow-size:520px] hover:shadow-[0_20px_44px_rgb(79_70_229/0.22)] md:px-12 md:py-14"
          >
            <div className="flex max-w-170 flex-col gap-2.5">
              <h2 className="font-heading text-[clamp(1.625rem,3vw,2.375rem)] leading-[1.1] font-bold tracking-[-0.02em]">
                {cta.title}
              </h2>
              {cta.text ? <RichTextOrPlain value={cta.text} className="text-lg" /> : null}
            </div>
            {cta.buttonLabel && cta.buttonHref && isSafeHref(cta.buttonHref) ? (
              <Button
                asChild
                className="h-auto rounded-xl bg-ink px-6.5 py-4.5 text-base font-bold text-primary-foreground hover:bg-ink/85 focus-visible:ring-primary-foreground"
              >
                <Link href={cta.buttonHref}>{cta.buttonLabel} →</Link>
              </Button>
            ) : null}
          </GlowCard>
        </section>
      ) : null}
    </>
  )
}
