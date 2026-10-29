import Link from 'next/link'
import { getSettings } from '@/data/settings'

export async function SiteFooter() {
  const settings = await getSettings()
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
        <span>{settings.footerText}</span>
        <nav aria-label="Liens de pied de page" className="flex flex-wrap gap-4">
          {settings.footerNav?.map((link) => (
            <Link key={link.id ?? link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
