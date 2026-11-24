import type { Where } from 'payload'

// A published-only filter, dropped while previewing drafts (src/lib/preview.ts): only the
// `_status` condition goes, every other condition stays.
export const withoutPublishedFilter = (where: Where | undefined): Where | undefined => {
  if (!where) return where
  const { _status, ...rest } = where
  const and = Array.isArray(rest.and)
    ? rest.and.map(withoutPublishedFilter).filter((part): part is Where => Boolean(part))
    : undefined
  const result: Where = { ...rest, ...(and ? { and } : {}) }
  if (and && !and.length) delete result.and
  return Object.keys(result).length ? result : undefined
}

// Published, or any status while previewing.
export const isShown = (doc: { _status?: string | null } | null | undefined, preview: boolean) =>
  Boolean(doc) && (preview || doc?._status === 'published')
