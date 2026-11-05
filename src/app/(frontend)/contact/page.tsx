import type { Metadata } from 'next'
import { ArrowLink } from '@/components/arrow-link'
import { ContactForm } from '@/components/contact-form'
import { CopyButton } from '@/components/copy-button'
import { GlowCard } from '@/components/glow-card'
import { PhosphorIcon } from '@/components/phosphor-icon'
import { RichTitle } from '@/components/rich-title'
import { getContactPage } from '@/data/settings'
import { mailtoAddress } from '@/lib/mailto'
import { isSafeHref } from '@/lib/safe-href'

// Page « Contact » (designs/31-page-contact): title, intro and contact cards on the left, the
// form on the right (stacked on mobile). Every text comes from the « Page Contact » global.

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage()
  return {
    title: page.seo?.title ?? 'Contact',
    description: page.seo?.description ?? page.intro ?? undefined,
  }
}

// Icon rounds follow the hero gradient from lilac to peach, card after card (designer's
// colours); beyond four cards the steps repeat.
const tones = [
  'bg-[#e8e4f6] text-primary-strong',
  'bg-[#ede9f2] text-primary-strong',
  'bg-[#f7e7e2] text-[#6b4a3c]',
  'bg-[#f8e6df] text-[#6b4a3c]',
]

export default async function ContactPageView() {
  const page = await getContactPage()
  const cards = page.cards ?? []

  return (
    <>
      {/* Indigo & peach glow behind the header and title (body is the positioned ancestor). */}
      <div aria-hidden="true" className="bg-hero absolute inset-x-0 top-0 -z-10 h-[1000px]" />

      <section className="grid grid-cols-[repeat(auto-fit,minmax(min(26.25rem,100%),1fr))] items-start gap-14 pt-12 pb-16 md:pt-16 md:pb-24">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4.5">
            <h1 className="font-heading text-[clamp(2rem,4vw,3.125rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance">
              <RichTitle value={page.title} />
            </h1>
            {page.intro ? (
              <p className="text-[1.1875rem] leading-[1.55] text-foreground-soft">{page.intro}</p>
            ) : null}
          </div>

          {cards.length ? (
            <ul className="flex flex-col gap-2.5">
              {cards.map((card, index) => {
                const href = card.href && isSafeHref(card.href) ? card.href : null
                const _external = href?.startsWith('http')
                // mailto: link → a button copies the bare address next to it.
                const email = mailtoAddress(href)
                return (
                  <li key={card.id ?? card.value}>
                    <GlowCard
                      as="div"
                      className="flex items-center gap-3.5 rounded-[1.125rem] border bg-card px-4.5 py-4 hover:border-[#dcdaf8] hover:shadow-[0_12px_28px_rgb(79_70_229/0.04)]"
                    >
                      <span
                        aria-hidden="true"
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-base font-extrabold ${tones[index % tones.length]}`}
                      >
                        {card.monogram || <PhosphorIcon name={card.icon} />}
                      </span>
                      <span className="flex min-w-0 flex-col gap-0.5">
                        {card.label ? (
                          <span className="text-base text-foreground-soft">{card.label}</span>
                        ) : null}
                        {href ? (
                          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <ArrowLink
                              href={href}
                              className="max-w-full text-base [&_.arrow-link-text]:min-w-0 [&_.arrow-link-text]:break-words"
                            >
                              {/* The round's pictogram replaces a typed arrow. */}
                              {card.value.replace(/\s*[→↗]\s*$/, '')}
                            </ArrowLink>
                            {email ? <CopyButton value={email} label={`Copier l’adresse ${email}`} /> : null}
                          </span>
                        ) : (
                          <strong className="break-words">{card.value}</strong>
                        )}
                      </span>
                    </GlowCard>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>

        <div className="relative rounded-[1.75rem] border bg-card p-6 shadow-[0_30px_60px_rgb(40_36_90/0.08)] md:p-9">
          <ContactForm texts={page.form ?? {}} />
        </div>
      </section>
    </>
  )
}
