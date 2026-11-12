import type { Metadata } from 'next'
import { ArrowLink } from '@/components/arrow-link'
import { CtaLink } from '@/components/cta-link'
import { RichTitle } from '@/components/rich-title'
import { getNotFoundPage } from '@/data/settings'
import { isSafeHref } from '@/lib/safe-href'

// Page 404 « Le test utilisateur raté » (designs/76-page-404): the text on the left, a decorative
// test report on the right (stats, heat spots on a blank screen, verdict). Texts: « Page 404 ».

export const metadata: Metadata = { title: 'Page introuvable' }

// Heat spots on the report screen: position (%), size (px) and start delay (s).
const spots = [
  { left: 18, top: 22, size: 80, delay: 0.3 },
  { left: 58, top: 40, size: 110, delay: 0.7 },
  { left: 36, top: 58, size: 80, delay: 1.1 },
]

export default async function NotFound() {
  const page = await getNotFoundPage()
  const report = page.report ?? {}
  const stats = report.stats ?? []
  const linkHref = page.linkHref && isSafeHref(page.linkHref) ? page.linkHref : null

  return (
    <>
      {/* Indigo & peach glow behind the header and title (body is the positioned ancestor). */}
      <div aria-hidden="true" className="bg-hero absolute inset-x-0 top-0 -z-10 h-[1000px]" />

      <section className="grid items-center gap-12 pt-12 pb-16 md:min-h-[40rem] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:pb-24">
        <div className="flex flex-col items-start gap-5.5">
          {page.badge ? (
            <span className="rounded-full bg-[#fde7e0] px-3 py-1.5 text-sm font-bold text-[#b4401c]">
              {page.badge}
            </span>
          ) : null}
          <h1 className="font-heading text-[clamp(2rem,4vw,3.125rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance">
            <RichTitle value={page.title} />
          </h1>
          {page.text ? (
            <p className="max-w-[30rem] text-lg leading-[1.6] text-foreground-soft">{page.text}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-7">
            <CtaLink href="/">{page.homeLabel || 'Retour à l’accueil'}</CtaLink>
            {linkHref && page.linkLabel ? <ArrowLink href={linkHref}>{page.linkLabel}</ArrowLink> : null}
          </div>
        </div>

        <div aria-hidden="true" className="flex flex-col gap-3.5">
          {stats.length ? (
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat, index) => (
                <div
                  key={stat.id ?? stat.label}
                  className="flex flex-col gap-1.5 rounded-2xl border bg-card p-3.5 shadow-[0_12px_26px_rgb(40_36_90/0.06)]"
                >
                  <span className="text-sm leading-snug text-muted-foreground">{stat.label}</span>
                  <strong
                    className={`font-heading text-2xl font-semibold ${index === 0 ? 'text-[#b4401c]' : ''} ${index === 1 ? 'nf-shake self-start' : ''}`}
                  >
                    {stat.value}
                  </strong>
                </div>
              ))}
            </div>
          ) : null}
          <div className="overflow-hidden rounded-[1.125rem] border bg-card shadow-[0_20px_40px_rgb(40_36_90/0.08)]">
            <div className="flex gap-1.5 border-b border-[#f1f1f5] px-3.5 py-2.5">
              <i className="size-2.25 rounded-full bg-[#e3e4ec]" />
              <i className="size-2.25 rounded-full bg-[#e3e4ec]" />
              <i className="size-2.25 rounded-full bg-[#e3e4ec]" />
            </div>
            <div className="relative flex h-57.5 items-center justify-center overflow-hidden">
              <span className="font-heading text-[5.25rem] font-bold tracking-[-0.04em] text-[#eeedfb]">
                404
              </span>
              {spots.map((spot) => (
                <span
                  key={spot.delay}
                  className="nf-heat"
                  style={{
                    left: `${spot.left}%`,
                    top: `${spot.top}%`,
                    width: spot.size,
                    height: spot.size,
                    animationDelay: `${spot.delay}s`,
                  }}
                />
              ))}
              <span className="nf-click top-[52%] left-[63%]" />
            </div>
          </div>
          {report.diagnosis || report.recommendation ? (
            <p className="rounded-2xl bg-foreground px-4 py-3.5 text-base leading-[1.7] text-white">
              {report.diagnosis ? (
                <>
                  <strong>Diagnostic</strong> · {report.diagnosis}
                </>
              ) : null}
              {report.diagnosis && report.recommendation ? <br /> : null}
              {report.recommendation ? (
                <>
                  <strong>Recommandation</strong> · {report.recommendation}
                  {report.severity ? (
                    <>
                      {' '}
                      (sévérité : <span className="font-bold text-[#f6a58a]">{report.severity}</span>)
                    </>
                  ) : null}
                </>
              ) : null}
            </p>
          ) : null}
        </div>
      </section>
    </>
  )
}
