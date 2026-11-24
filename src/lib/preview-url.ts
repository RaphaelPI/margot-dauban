// « Aperçu » button of the admin (collections and page globals): opens the page through /apercu,
// which turns draft preview on for the logged-in editor and redirects to it.
export const previewUrl = (path: string) => `/apercu?chemin=${encodeURIComponent(path)}`

export const globalPreviewPaths: Record<string, string> = {
  home: '/',
  'projects-page': '/projets',
  'services-page': '/expertises',
  'faq-page': '/faq',
  'contact-page': '/contact',
  'testimonials-page': '/temoignages',
  // Any unknown address shows the 404 page.
  'not-found-page': '/page-introuvable-apercu',
}
