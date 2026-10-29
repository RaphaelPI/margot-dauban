import Link from 'next/link'
import { MediaImage } from '@/components/models/media-image'
import { Button } from '@/components/ui/button'
import { getSettings } from '@/data/settings'

export async function SiteHeader() {
  const settings = await getSettings()
  const initials = settings.siteName
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)

  return (
    <header className="mx-auto flex w-full max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-4 px-5 py-5.5 md:px-8">
      <Link href="/" className="flex items-center gap-3 rounded-full">
        {typeof settings.photo === 'object' && settings.photo ? (
          <MediaImage
            media={settings.photo}
            sizes="44px"
            className="size-11 rounded-full border-2 border-card object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-11 items-center justify-center rounded-full border-2 border-card bg-accent font-heading text-sm font-semibold"
          >
            {initials}
          </span>
        )}
        <span className="flex flex-col">
          <strong className="font-heading text-[0.9375rem] font-semibold">{settings.siteName}</strong>
          {settings.jobTitle ? (
            <span className="text-sm text-muted-foreground">{settings.jobTitle}</span>
          ) : null}
        </span>
      </Link>
      <nav
        aria-label="Navigation principale"
        className="flex flex-wrap items-center gap-x-7 gap-y-3 text-[0.9375rem] font-medium"
      >
        {settings.available ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-decor-border bg-card px-3.5 py-1.5 text-sm font-semibold text-success-foreground">
            <span
              aria-hidden="true"
              className="size-2 animate-blink rounded-full bg-success motion-reduce:animate-none"
            />
            {settings.availabilityLabel}
          </span>
        ) : null}
        {settings.headerNav?.map((link) => (
          <Link key={link.id ?? link.href} href={link.href} className="hover:text-primary-strong">
            {link.label}
          </Link>
        ))}
        {settings.headerCta?.label && settings.headerCta.href ? (
          <Button asChild className="h-auto rounded-full px-5 py-3 text-[0.9375rem] font-bold">
            <Link href={settings.headerCta.href}>{settings.headerCta.label}</Link>
          </Button>
        ) : null}
      </nav>
    </header>
  )
}
