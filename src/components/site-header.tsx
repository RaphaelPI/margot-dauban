import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getSettings } from '@/data/settings'

export async function SiteHeader() {
  const settings = await getSettings()
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
      <Link href="/" className="flex flex-col leading-tight">
        <strong className="font-heading text-lg">{settings.siteName}</strong>
        {settings.jobTitle ? (
          <span className="text-sm text-muted-foreground">{settings.jobTitle}</span>
        ) : null}
      </Link>
      <nav aria-label="Navigation principale" className="flex flex-wrap items-center gap-4 text-sm">
        {settings.available ? (
          <span className="flex items-center gap-2 text-muted-foreground">
            <span aria-hidden="true" className="size-2 rounded-full bg-emerald-500" />
            {settings.availabilityLabel}
          </span>
        ) : null}
        {settings.headerNav?.map((link) => (
          <Link key={link.id ?? link.href} href={link.href} className="hover:text-primary">
            {link.label}
          </Link>
        ))}
        {settings.headerCta?.label && settings.headerCta.href ? (
          <Button asChild size="sm">
            <Link href={settings.headerCta.href}>{settings.headerCta.label}</Link>
          </Button>
        ) : null}
      </nav>
    </header>
  )
}
