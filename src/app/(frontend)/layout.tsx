import type { Metadata } from 'next'
import { Albert_Sans, Unbounded } from 'next/font/google'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getSettings } from '@/data/settings'
import './globals.css'

const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-unbounded',
  display: 'swap',
})
const albertSans = Albert_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-albert-sans',
  display: 'swap',
})

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
    <html lang="fr" className={`${unbounded.variable} ${albertSans.variable}`}>
      <body className="relative isolate flex min-h-dvh flex-col overflow-x-clip bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-page flex-1 px-5 pb-16 md:px-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
