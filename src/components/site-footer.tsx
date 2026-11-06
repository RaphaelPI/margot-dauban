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

// Footer (designs/56-cookies, Footer-Verre, without the frosted panel: designer's choice): right on
// the lilac / peach gradient, identity, two link columns and a call to action. The call-to-action column
// hides itself on pages that already end with the indigo band ([data-cta-band], globals.css).
export async function SiteFooter() {
  const settings = await getSettings()
  const cta = settings.footerCta
  const showCta = Boolean(cta?.label && cta.href && isSafeHref(cta.href))

  return (
    <footer className="relative bg-[#f3eef1] bg-[image:radial-gradient(900px_420px_at_12%_100%,#dad8fa,rgb(243_238_241/0)_70%),radial-gradient(900px_420px_at_88%_100%,#fce1d3,rgb(243_238_241/0)_70%),linear-gradient(180deg,#f7f7fa_0%,#f3eef1_100%)] px-5 pt-16 pb-8 md:px-8 md:pt-24">
      {/* Hairlines fading out at both ends (designer's choice). */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#d9dae4_20%,#d9dae4_80%,transparent)]"
      />
      <div className="mx-auto flex w-full max-w-page flex-col gap-12">
        <div className="grid gap-9 px-2 md:grid-cols-2 md:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,1fr)_auto]">
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
            <nav aria-label={settings.footerNavTitle || 'Liens'} className="flex flex-col gap-4">
              {settings.footerNavTitle ? (
                <span aria-hidden="true" className={heading}>
                  {settings.footerNavTitle}
                </span>
              ) : null}
              <ul className="flex flex-col gap-3 text-base">
                <FooterLinks links={settings.footerNav} />
              </ul>
            </nav>
          ) : null}

          {settings.footerLegal?.length || settings.gaId ? (
            <nav
              aria-label={settings.footerLegalTitle || 'Informations légales'}
              className="flex flex-col gap-4"
            >
              {settings.footerLegalTitle ? (
                <span aria-hidden="true" className={heading}>
                  {settings.footerLegalTitle}
                </span>
              ) : null}
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

        <div className="relative pt-5.5 text-center text-[0.8125rem] text-foreground-soft">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(79_70_229/0.1)_20%,rgb(79_70_229/0.1)_80%,transparent)]"
          />
          <p className="flex flex-wrap items-center justify-center gap-x-7 gap-y-1.5">
            {settings.footerCopyright ? <span>{settings.footerCopyright}</span> : null}
            {settings.footerBottomLinks
              ?.filter((link) => isSafeHref(link.href))
              .map((link) => {
                const external = /^https?:/.test(link.href)
                return (
                  <span key={link.id ?? link.href}>
                    {external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-strong hover:underline"
                      >
                        {link.label}
                        <span className="sr-only"> (nouvel onglet)</span>
                      </a>
                    ) : (
                      <Link href={link.href} className="hover:text-primary-strong hover:underline">
                        {link.label}
                      </Link>
                    )}
                  </span>
                )
              })}
          </p>
        </div>
      </div>
    </footer>
  )
}
