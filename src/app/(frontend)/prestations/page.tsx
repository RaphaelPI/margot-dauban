import type { Metadata } from 'next'
import Link from 'next/link'
import { GlowCard } from '@/components/glow-card'
import { MediaImage } from '@/components/models/media-image'
import { ServiceLine } from '@/components/models/service-line'
import { ProcessShowcase } from '@/components/process-showcase'
import { RichTextOrPlain } from '@/components/rich-text-or-plain'
import { Button } from '@/components/ui/button'
import { getServiceIds } from '@/data/ids'
import { getServicesPage } from '@/data/settings'
import { isSafeHref } from '@/lib/safe-href'

// Page « Prestations » (designs/13-page-prestations): who Margot is, her expertises (the
// `services` collection, admin order), how a mission unfolds, team offer, contact band.

export async function generateMetadata(): Promise<Metadata> {
  const page = await getServicesPage()
  return {
    title: page.seo?.title ?? 'Prestations',
    description: page.seo?.description ?? page.hero?.lead ?? undefined,
  }
}

const body =
  'text-[1.0625rem] leading-[1.7] text-foreground-soft [&_a]:font-bold [&_a]:text-primary-strong [&_a]:decoration-2 [&_a]:underline-offset-4'

export default async function ServicesPage() {
  const [page, serviceIds] = await Promise.all([getServicesPage(), getServiceIds()])
  const { hero, process, team, cta } = page
  const steps = process?.steps ?? []

  return (
    <>
      {/* Indigo & peach glow behind the header and title (body is the positioned ancestor). */}
      <div aria-hidden="true" className="bg-hero absolute inset-x-0 top-0 -z-10 h-[1000px]" />

      <section className="grid grid-cols-[repeat(auto-fit,minmax(min(26.25rem,100%),1fr))] items-center gap-16 pt-12 pb-20 md:pt-16 md:pb-26">
        <div className="flex flex-col gap-5">
          <nav aria-label="Fil d’Ariane" className="text-xs text-muted-foreground">
            <ol className="flex flex-wrap gap-1.5">
              <li>
                <Link href="/" className="underline underline-offset-4 hover:text-primary-strong">
                  Accueil
                </Link>{' '}
                /
              </li>
              <li aria-current="page">Prestations</li>
            </ol>
          </nav>
          <h1 className="font-heading text-[clamp(2rem,4vw,3.25rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance">
            {hero?.title}{' '}
            {hero?.highlight ? (
              <span className="rounded-[0.875rem] bg-accent px-3 md:whitespace-nowrap">{hero.highlight}</span>
            ) : null}
          </h1>
          {hero?.lead ? <p className="text-xl leading-[1.55] font-semibold">{hero.lead}</p> : null}
          {hero?.body ? <RichTextOrPlain value={hero.body} className={`${body} [&_p+p]:mt-5`} /> : null}
          {hero?.callout ? (
            <RichTextOrPlain
              value={hero.callout}
              className="rounded-2xl border border-[#e3e4ec] bg-card px-5.5 py-4.5 text-[1.0625rem] leading-[1.7]"
            />
          ) : null}
        </div>
        <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#e3e4ec] bg-[radial-gradient(420px_circle_at_20%_15%,#dad8fa,rgb(218_216_250/0)_70%),radial-gradient(420px_circle_at_85%_90%,#fce1d3,rgb(252_225_211/0)_70%),#f3f1f7]">
          <MediaImage
            media={hero?.portrait}
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className="size-full object-cover"
          />
        </div>
      </section>

      {serviceIds.length ? (
        <section aria-labelledby="expertises" className="flex flex-col gap-7 pb-20 md:pb-26">
          <h2
            id="expertises"
            className="font-heading text-[1.875rem] font-semibold tracking-[-0.02em] md:text-[2.375rem]"
          >
            {page.expertisesTitle || 'Mes expertises'}
          </h2>
          <div className="border-b">
            {serviceIds.map((id) => (
              <ServiceLine key={id} id={id} />
            ))}
          </div>
        </section>
      ) : null}

      {steps.length ? (
        <section aria-labelledby="methode" className="flex flex-col gap-12 pb-20 md:pb-26">
          <div className="flex max-w-180 flex-col gap-3">
            {process?.eyebrow ? (
              <span className="text-base font-bold tracking-[0.08em] text-primary uppercase">
                {process.eyebrow}
              </span>
            ) : null}
            <h2
              id="methode"
              className="font-heading text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.15] font-semibold tracking-[-0.02em]"
            >
              {process?.title}
            </h2>
            {process?.intro ? (
              <p className="text-lg leading-[1.6] text-foreground-soft">{process.intro}</p>
            ) : null}
          </div>
          <ProcessShowcase steps={steps} />
        </section>
      ) : null}

      {team?.title ? (
        <section aria-labelledby="equipe" className="pb-18">
          <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-6 rounded-[1.75rem] border bg-card p-10">
            <div className="flex flex-[999_1_32.5rem] flex-col gap-2.5">
              <h2 id="equipe" className="font-heading text-2xl font-semibold">
                {team.title}
              </h2>
              {team.text ? (
                <RichTextOrPlain
                  value={team.text}
                  className="text-[1.0625rem] leading-[1.65] text-foreground-soft"
                />
              ) : null}
            </div>
            {team.labels?.length ? (
              <ul className="flex flex-[1_1_13.75rem] flex-wrap justify-end gap-2.5 font-heading text-base font-semibold">
                {team.labels.map((label, index) => (
                  <li
                    key={label}
                    className={`rounded-[0.875rem] px-4.5 py-3.5 ${index % 2 ? 'bg-[#f6eeea]' : 'bg-[#f4f3ff]'}`}
                  >
                    {label}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      {cta?.title ? (
        <section className="pb-4">
          <GlowCard
            as="div"
            className="flex flex-wrap items-center justify-between gap-8 rounded-[2rem] bg-primary px-7 py-12 text-primary-foreground [--glow-from:rgb(140_133_255/0.85)] [--glow-mid:rgb(120_112_250/0.35)] [--glow-size:520px] hover:shadow-[0_20px_44px_rgb(79_70_229/0.22)] md:px-12 md:py-18"
          >
            <div className="flex max-w-180 flex-col gap-2.5">
              <h2 className="font-heading text-[clamp(1.875rem,3.6vw,2.875rem)] leading-[1.08] font-bold tracking-[-0.02em]">
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
