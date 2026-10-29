import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache'
import { getPayload } from '@/lib/payload'

export async function getSettings() {
  'use cache'
  cacheLife('model')
  cacheTag(tags.global('settings'))
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'settings', depth: 0 })
}
