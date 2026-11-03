import { describe, expect, it } from 'vitest'
import { orderKey } from './order-key'

describe('orderKey', () => {
  it('produces strictly increasing keys', () => {
    const keys = Array.from({ length: 200 }, (_, index) => orderKey(index))
    expect(keys.slice(0, 3)).toEqual(['a0', 'a1', 'a2'])
    expect(keys[62]).toBe('b00')
    for (let i = 1; i < keys.length; i++) expect(keys[i] > keys[i - 1]).toBe(true)
  })
})
