import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'

// « Aperçu » from the admin: an editor logged in to the admin sees the site with its drafts
// (draft mode cookie, this browser only), starting at `?chemin=`. Anyone else goes to the login.
const samePath = (value: string | null) =>
  value?.startsWith('/') && !value.startsWith('//') && !value.includes('\\') ? value : '/'

export async function GET(request: Request) {
  const path = samePath(new URL(request.url).searchParams.get('chemin'))
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user)
    redirect(`/admin/login?redirect=${encodeURIComponent(`/apercu?chemin=${encodeURIComponent(path)}`)}`)
  ;(await draftMode()).enable()
  redirect(path)
}
