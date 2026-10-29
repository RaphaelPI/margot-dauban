import Link from 'next/link'
import { getSettings } from '@/data/settings'

export async function SiteHeader() {
  const settings = await getSettings()
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
      <Link href="/" className="font-heading text-lg font-semibold">
        {settings.siteName}
      </Link>
      {settings.email ? (
        <a href={`mailto:${settings.email}`} className="text-sm text-muted-foreground hover:text-foreground">
          Contact
        </a>
      ) : null}
    </header>
  )
}
