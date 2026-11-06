import Link from 'next/link'
import { Suspense } from 'react'
import { CtaLink } from '@/components/cta-link'
import { MobileMenu } from '@/components/mobile-menu'
import { MediaImage } from '@/components/models/media-image'
import { NavLinks } from '@/components/nav-links'
import { StickyHeader } from '@/components/sticky-header'
import { getSettings } from '@/data/settings'

export async function SiteHeader() {
  const settings = await getSettings()
  const initials = settings.siteName
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)

  return (
    // Stays visible while scrolling. Phones get the logo and a burger (MobileMenu); over the open
    // menu the header turns see-through and white (`data-menu` on <html>, beats the scroll fade).
    <StickyHeader
      id="haut"
      className="header-fade sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md transition-colors [html[data-menu=open]_&]:border-transparent! [html[data-menu=open]_&]:bg-transparent! [html[data-menu=open]_&]:text-white [html[data-menu=open]_&]:backdrop-blur-none!"
    >
      <div className="header-bar mx-auto flex w-full max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-4 px-5 md:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center rounded-full">
            {typeof settings.photo === 'object' && settings.photo ? (
              <MediaImage media={settings.photo} sizes="52px" className="size-13 rounded-full object-cover" />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-13 items-center justify-center rounded-full bg-accent font-heading text-sm font-semibold"
              >
                {initials}
              </span>
            )}
            <span className="header-fold flex flex-col pl-3">
              <strong className="font-heading text-[0.9375rem] font-semibold">{settings.siteName}</strong>
              {settings.jobTitle ? (
                <span className="text-sm text-muted-foreground [html[data-menu=open]_&]:text-white/75">
                  {settings.jobTitle}
                </span>
              ) : null}
            </span>
          </Link>
          {settings.available ? (
            <span className="header-fold ml-5 hidden items-center gap-2 rounded-full border border-decor-border bg-card px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap text-success-foreground md:inline-flex">
              <span
                aria-hidden="true"
                className="size-2 animate-blink rounded-full bg-success motion-reduce:animate-none"
              />
              {settings.availabilityLabel}
            </span>
          ) : null}
        </div>
        <nav
          aria-label="Navigation principale"
          className="hidden flex-wrap items-center gap-x-7 gap-y-3 text-base font-medium md:flex"
        >
          {/* The current page is only known per request: static links meanwhile. */}
          <Suspense
            fallback={settings.headerNav?.map((link) => (
              <Link key={link.id ?? link.href} href={link.href} className="hover:text-primary-strong">
                {link.label}
              </Link>
            ))}
          >
            <NavLinks links={settings.headerNav ?? []} />
          </Suspense>
          {settings.headerCta?.label && settings.headerCta.href ? (
            <CtaLink href={settings.headerCta.href}>{settings.headerCta.label}</CtaLink>
          ) : null}
        </nav>
        <MobileMenu
          links={settings.headerNav ?? []}
          cta={settings.headerCta}
          smallLinks={settings.mobileNavLinks ?? []}
        />
      </div>
    </StickyHeader>
  )
}
