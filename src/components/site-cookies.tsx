import { CookieConsent } from '@/components/cookie-consent'
import { RichTextOrPlain } from '@/components/rich-text-or-plain'
import { getSettings } from '@/data/settings'

// Cookie banner, only when a Google Analytics ID is set in Réglages › Cookies.
export async function SiteCookies() {
  const settings = await getSettings()
  const gaId = settings.gaId?.trim()
  if (!gaId) return null
  const banner = settings.cookieBanner
  return (
    <CookieConsent
      gaId={gaId}
      title={banner?.title || 'Cookies'}
      refuseLabel={banner?.refuseLabel || 'Refuser'}
      acceptLabel={banner?.acceptLabel || 'Accepter'}
    >
      {banner?.text ? <RichTextOrPlain value={banner.text} /> : null}
    </CookieConsent>
  )
}
