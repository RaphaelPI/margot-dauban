import { describe, expect, it } from 'vitest'
import { isShown, withoutPublishedFilter } from './preview-filter'

const published = { _status: { equals: 'published' } }
const slug = { slug: { equals: 'bikini' } }

describe('draft preview filters', () => {
  it('drops only the published condition', () => {
    expect(withoutPublishedFilter(published)).toBeUndefined()
    expect(withoutPublishedFilter({ and: [published, slug] })).toEqual({ and: [slug] })
    expect(withoutPublishedFilter({ ...published, ...slug })).toEqual(slug)
    expect(withoutPublishedFilter(slug)).toEqual(slug)
    expect(withoutPublishedFilter(undefined)).toBeUndefined()
  })

  it('shows drafts only while previewing', () => {
    expect(isShown({ _status: 'published' }, false)).toBe(true)
    expect(isShown({ _status: 'draft' }, false)).toBe(false)
    expect(isShown({ _status: 'draft' }, true)).toBe(true)
    expect(isShown(null, true)).toBe(false)
  })
})
