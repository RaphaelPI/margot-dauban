import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'
import { getSettings } from '@/data/settings'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: { default: settings.siteName, template: `%s · ${settings.siteName}` },
    description: settings.tagline ?? undefined,
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl px-6 pb-24">{children}</main>
      </body>
    </html>
  )
}
