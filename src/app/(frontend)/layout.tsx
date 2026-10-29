import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getSettings } from '@/data/settings'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const title = settings.seo?.title ?? `${settings.siteName} — ${settings.jobTitle ?? ''}`.trim()
  return {
    title: { default: title, template: `%s · ${settings.siteName}` },
    description: settings.seo?.description ?? undefined,
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
