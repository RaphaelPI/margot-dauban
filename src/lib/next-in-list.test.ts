import { describe, expect, it } from 'vitest'
import { nextInList } from './next-in-list'

describe('nextInList', () => {
  it('returns the following item', () => {
    expect(nextInList(['a', 'b', 'c'], 'a')).toBe('b')
  })
  it('wraps to the first item after the last', () => {
    expect(nextInList(['a', 'b', 'c'], 'c')).toBe('a')
  })
  it('returns null when the item is alone or missing', () => {
    expect(nextInList(['a'], 'a')).toBeNull()
    expect(nextInList(['a', 'b'], 'z')).toBeNull()
  })
})
