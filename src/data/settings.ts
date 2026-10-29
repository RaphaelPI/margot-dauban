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
