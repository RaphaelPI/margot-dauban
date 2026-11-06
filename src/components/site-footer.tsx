import Link from 'next/link'
import { CookieSettingsButton } from '@/components/cookie-consent'
import { CtaLink } from '@/components/cta-link'
import { MediaImage } from '@/components/models/media-image'
import { getSettings } from '@/data/settings'
import { isSafeHref } from '@/lib/safe-href'

type FooterLink = { id?: string | null; label: string; href: string }

const linkClass =
  'bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_1.5px] bg-left-bottom bg-no-repeat pb-0.5 font-semibold transition-[background-size,color] duration-300 hover:bg-[length:100%_1.5px] hover:text-primary-strong motion-reduce:transition-none'
const heading = 'text-xs font-bold tracking-[0.08em] text-foreground-soft uppercase'
const item =
  "flex items-baseline gap-2.5 before:shrink-0 before:font-bold before:text-[#8c85ff] before:content-['–']"

function FooterLinks({ links }: { links: FooterLink[] }) {
  return links
    .filter((link) => isSafeHref(link.href))
    .map((link) => {
      const external = /^https?:/.test(link.href)
      return (
        <li key={link.id ?? link.href} className={item}>
          {external ? (
            <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {link.label}
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
          ) : (
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          )}
        </li>
      )
    })
}

// Footer « panneau en verre » (designs/56-cookies, Footer-Verre): a frosted panel on the lilac /
// peach gradient with identity, two link columns and a call to action. The call-to-action column
// hides itself on pages that already end with the indigo band ([data-cta-band], globals.css).
export async function SiteFooter() {
  const settings = await getSettings()
  const cta = settings.footerCta
  const showCta = Boolean(cta?.label && cta.href && isSafeHref(cta.href))

  return (
    <footer className="bg-[#f3eef1] bg-[image:radial-gradient(900px_420px_at_12%_100%,#dad8fa,rgb(243_238_241/0)_70%),radial-gradient(900px_420px_at_88%_100%,#fce1d3,rgb(243_238_241/0)_70%),linear-gradient(180deg,#f7f7fa_0%,#f3eef1_100%)] px-5 pt-16 pb-8 md:px-8 md:pt-24">
      <div className="mx-auto flex w-full max-w-page flex-col gap-6">
        <div className="grid gap-9 rounded-[2.25rem] border border-white/90 bg-white/55 p-7 shadow-[0_24px_60px_rgb(40_36_90/0.08)] backdrop-blur-lg md:grid-cols-2 md:p-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-3">
              {typeof settings.photo === 'object' && settings.photo ? (
                <MediaImage
                  media={settings.photo}
                  sizes="48px"
                  className="size-12 rounded-full object-cover"
                />
              ) : null}
              <strong className="font-heading text-lg font-semibold">{settings.siteName}</strong>
            </span>
            {settings.footerText ? (
              <p className="max-w-75 text-base leading-normal text-foreground-soft">{settings.footerText}</p>
            ) : null}
          </div>

          {settings.footerNav?.length ? (
            <nav aria-labelledby="pied-nav" className="flex flex-col gap-4">
              <span id="pied-nav" className={heading}>
                {settings.footerNavTitle || 'Me trouver'}
              </span>
              <ul className="flex flex-col gap-3 text-base">
                <FooterLinks links={settings.footerNav} />
              </ul>
            </nav>
          ) : null}

          {settings.footerLegal?.length || settings.gaId ? (
            <nav aria-labelledby="pied-legal" className="flex flex-col gap-4">
              <span id="pied-legal" className={heading}>
                {settings.footerLegalTitle || 'Légal'}
              </span>
              <ul className="flex flex-col gap-3 text-base">
                <FooterLinks links={settings.footerLegal ?? []} />
                {settings.gaId ? (
                  <li className={item}>
                    <CookieSettingsButton
                      label={settings.cookieBanner?.manageLabel || 'Gérer les cookies'}
                      className={linkClass}
                    />
                  </li>
                ) : null}
              </ul>
            </nav>
          ) : null}

          {showCta && cta?.href ? (
            <div className="footer-cta flex flex-col items-start gap-4.5">
              {cta.title ? (
                <strong className="font-heading text-xl leading-tight font-semibold">{cta.title}</strong>
              ) : null}
              <CtaLink href={cta.href} tone="black">
                {cta.label}
              </CtaLink>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-primary/15 px-2 pt-5.5 text-[0.8125rem] text-foreground-soft md:px-6">
          <span>{settings.footerCopyright}</span>
          <a href="#haut" className="group flex items-center gap-2.5 text-sm font-bold text-foreground">
            {settings.footerTopLabel || 'Retour en haut'}
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-full bg-[#e7e6ff] text-primary-strong transition-[background-color,color,transform] duration-300 group-hover:-translate-y-0.75 group-hover:bg-primary group-hover:text-white motion-reduce:transition-none"
            >
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
