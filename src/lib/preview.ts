import 'server-only'
import { draftMode } from 'next/headers'
import type { Where } from 'payload'

// Draft preview (« Aperçu » in the admin → /apercu): while Next's draft mode is on, the site reads
// the latest drafts instead of the published versions. Readable inside 'use cache' scopes: Next
// re-runs them on every draft request and never stores the result (docs: use-cache › Draft Mode).
export const isPreview = async () => (await draftMode()).isEnabled

// A published-only filter, dropped while previewing (drafts and unpublished docs are shown too).
export const withoutPublishedFilter = (where: Where | undefined): Where | undefined => {
  if (!where) return where
  if ('_status' in where) return undefined
  if (Array.isArray(where.and)) {
    const and = where.and.map(withoutPublishedFilter).filter((part): part is Where => Boolean(part))
    return and.length ? { ...where, and } : undefined
  }
  return where
}

// Published, or any status while previewing.
export const isShown = (doc: { _status?: string | null } | null | undefined, preview: boolean) =>
  Boolean(doc) && (preview || doc?._status === 'published')
