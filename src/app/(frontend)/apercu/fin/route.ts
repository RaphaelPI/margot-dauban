import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

// « Quitter l'aperçu »: back to the published site, on the same page.
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get('chemin')
  ;(await draftMode()).disable()
  redirect(path?.startsWith('/') && !path.startsWith('//') && !path.includes('\\') ? path : '/')
}
