import { cacheTag, revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  GlobalAfterChangeHook,
  GlobalConfig,
} from 'payload'

// One naming scheme for every cache tag. Model components tag what they render with
// `tags.doc`, lists and slug lookups with `tags.collection`, globals with `tags.global`.
export const tags = {
  collection: (slug: string) => slug,
  doc: (slug: string, id: string | number) => `${slug}:${id}`,
  global: (slug: string) => `global:${slug}`,
}

// Inside a model component: tag every populated related doc it renders (ids-only values skipped).
export const tagDocs = (collection: string, ...docs: unknown[]) => {
  for (const doc of docs.flat()) {
    if (doc && typeof doc === 'object' && 'id' in doc) cacheTag(tags.doc(collection, String(doc.id)))
  }
}

// Payload hooks run outside a Server Action: `{ expire: 0 }` = next request is fresh.
const expire = (tag: string) => revalidateTag(tag, { expire: 0 })

type Status = { _status?: 'draft' | 'published' | null }

const afterChange: CollectionAfterChangeHook = ({ collection, doc, previousDoc, context }) => {
  // Scripts outside Next (seed, migrations) pass this flag: revalidateTag needs a Next request.
  if (context.disableRevalidate) return doc
  // Draft saves don't change the public site, unless they unpublish it.
  const published = (d: Status | undefined) => d?._status === 'published'
  if (collection.versions?.drafts && !published(doc) && !published(previousDoc)) return doc
  expire(tags.doc(collection.slug, doc.id))
  expire(tags.collection(collection.slug))
  return doc
}

const afterDelete: CollectionAfterDeleteHook = ({ collection, doc, context }) => {
  if (context.disableRevalidate) return doc
  expire(tags.doc(collection.slug, doc.id))
  expire(tags.collection(collection.slug))
  return doc
}

const globalAfterChange: GlobalAfterChangeHook = ({ global, doc, context }) => {
  if (context.disableRevalidate) return doc
  expire(tags.global(global.slug))
  return doc
}

// Applied to every collection and global in payload.config.ts, so none can be forgotten.
export const withRevalidation = (config: CollectionConfig): CollectionConfig => ({
  ...config,
  hooks: {
    ...config.hooks,
    afterChange: [...(config.hooks?.afterChange ?? []), afterChange],
    afterDelete: [...(config.hooks?.afterDelete ?? []), afterDelete],
  },
})

export const withGlobalRevalidation = (config: GlobalConfig): GlobalConfig => ({
  ...config,
  hooks: {
    ...config.hooks,
    afterChange: [...(config.hooks?.afterChange ?? []), globalAfterChange],
  },
})
