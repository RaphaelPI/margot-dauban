// Bare address of a `mailto:` link ("mailto:a%40b.fr?subject=x" → "a@b.fr"); null otherwise.
// A malformed escape typed in the admin never throws: the raw address is kept.
export function mailtoAddress(href: string | null | undefined): string | null {
  if (!href?.toLowerCase().startsWith('mailto:')) return null
  const raw = href.slice(7).split('?')[0].trim()
  if (!raw) return null
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}
