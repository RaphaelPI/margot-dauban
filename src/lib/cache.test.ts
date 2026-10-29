import type { CollectionConfig, GlobalConfig } from 'payload'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const revalidateTag = vi.fn()
const cacheTag = vi.fn()
vi.mock('next/cache', () => ({ cacheTag, revalidateTag }))

const { tagDocs, tags, withGlobalRevalidation, withRevalidation } = await import('./cache')

const drafts: CollectionConfig = { slug: 'projects', versions: { drafts: true }, fields: [] }
const plain: CollectionConfig = { slug: 'media', fields: [] }

// biome-ignore lint/suspicious/noExplicitAny: hook args are large Payload objects; tests pass only what the hooks read.
const run = (config: CollectionConfig, hook: 'afterChange' | 'afterDelete', args: any) =>
  withRevalidation(config).hooks?.[hook]?.at(-1)?.({ collection: config, context: {}, ...args })

const expired = () => revalidateTag.mock.calls.map(([tag]) => tag)

describe('revalidation hooks', () => {
  beforeEach(() => revalidateTag.mockClear())

  it('expires the doc and its collection when a doc is published', () => {
    run(drafts, 'afterChange', { doc: { id: '1', _status: 'published' }, previousDoc: {} })
    expect(expired()).toEqual(['projects:1', 'projects'])
    expect(revalidateTag).toHaveBeenCalledWith('projects:1', { expire: 0 })
  })

  it('ignores draft saves of an unpublished doc', () => {
    run(drafts, 'afterChange', { doc: { id: '1', _status: 'draft' }, previousDoc: { _status: 'draft' } })
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('expires when a published doc is unpublished', () => {
    run(drafts, 'afterChange', { doc: { id: '1', _status: 'draft' }, previousDoc: { _status: 'published' } })
    expect(expired()).toEqual(['projects:1', 'projects'])
  })

  it('expires collections without drafts on every change', () => {
    run(plain, 'afterChange', { doc: { id: '9' }, previousDoc: {} })
    expect(expired()).toEqual(['media:9', 'media'])
  })

  it('expires on delete', () => {
    run(drafts, 'afterDelete', { doc: { id: '1' } })
    expect(expired()).toEqual(['projects:1', 'projects'])
  })

  it('skips when the caller disables revalidation', () => {
    run(plain, 'afterChange', { doc: { id: '9' }, previousDoc: {}, context: { disableRevalidate: true } })
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('keeps existing hooks', () => {
    const own = vi.fn()
    const config = withRevalidation({ ...plain, hooks: { afterChange: [own] } })
    expect(config.hooks?.afterChange).toHaveLength(2)
    expect(config.hooks?.afterChange?.[0]).toBe(own)
  })

  it('expires the global tag', () => {
    const settings: GlobalConfig = { slug: 'settings', fields: [] }
    withGlobalRevalidation(settings).hooks?.afterChange?.at(-1)?.(
      // biome-ignore lint/suspicious/noExplicitAny: see run()
      { global: settings, doc: {}, context: {} } as any,
    )
    expect(expired()).toEqual([tags.global('settings')])
  })
})

describe('tagDocs', () => {
  it('tags populated docs and skips bare ids and empty values', () => {
    cacheTag.mockClear()
    tagDocs('media', { id: 'a' }, 'b', null, [{ id: 'c' }, undefined])
    expect(cacheTag.mock.calls.map(([tag]) => tag)).toEqual(['media:a', 'media:c'])
  })
})
