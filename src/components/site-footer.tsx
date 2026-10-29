import Link from 'next/link'
import { getSettings } from '@/data/settings'

export async function SiteFooter() {
  const settings = await getSettings()
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center justify-between gap-4 px-5 py-7 text-sm text-foreground-soft md:px-8">
        <span>{settings.footerText}</span>
        <nav aria-label="Liens de pied de page" className="flex flex-wrap gap-x-5 gap-y-2">
          {settings.footerNav?.map((link) => (
            <Link
              key={link.id ?? link.href}
              href={link.href}
              className="text-foreground underline underline-offset-4 hover:text-primary-strong"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
