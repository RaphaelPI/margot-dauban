import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

export async function getSettings() {
  'use cache'
  cacheLife('model')
  cacheTag(tags.global('settings'))
  const payload = await getPayload()
  const settings = await payload.findGlobal({ slug: 'settings', depth: 1 })
  if (typeof settings.photo === 'object' && settings.photo) cacheTag(tags.doc('media', settings.photo.id))
  return settings
}

export async function getHome() {
  'use cache'
  cacheLife('model')
  cacheTag(tags.global('home'))
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'home', depth: 0 })
}

export async function getServicesPage() {
  'use cache'
  cacheLife('model')
  cacheTag(tags.global('services-page'))
  const payload = await getPayload()
  const page = await payload.findGlobal({ slug: 'services-page', depth: 1 })
  const portrait = page.hero?.portrait
  if (typeof portrait === 'object' && portrait) cacheTag(tags.doc('media', portrait.id))
  return page
}
