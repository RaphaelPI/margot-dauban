// Visitor's cookie choice (analytics), kept in this browser for 6 months, then asked again.

export type Consent = 'granted' | 'denied'
const key = 'cookie-consent'
export const consentMaxAge = 182 * 24 * 60 * 60 * 1000

export function readConsent(now = Date.now()): Consent | null {
  try {
    const stored = JSON.parse(localStorage.getItem(key) ?? 'null') as { value?: string; at?: number } | null
    if (!stored || (stored.value !== 'granted' && stored.value !== 'denied')) return null
    if (typeof stored.at !== 'number' || now - stored.at > consentMaxAge) return null
    return stored.value
  } catch {
    return null
  }
}

export function saveConsent(value: Consent, now = Date.now()) {
  try {
    localStorage.setItem(key, JSON.stringify({ value, at: now }))
  } catch {
    // Private mode / storage blocked: the choice holds for this visit only.
  }
}

// Removes Google Analytics cookies (_ga, _ga_XXXX) on this site's domain and its parent.
export function clearAnalyticsCookies() {
  const names = document.cookie
    .split(';')
    .map((part) => part.split('=')[0].trim())
    .filter((name) => name === '_ga' || name.startsWith('_ga_') || name === '_gid')
  const host = location.hostname
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  for (const name of names) {
    for (const domain of domains) {
      // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not available in every browser yet
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`
    }
  }
}
