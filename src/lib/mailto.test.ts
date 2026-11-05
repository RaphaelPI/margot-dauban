import { describe, expect, it } from 'vitest'
import { mailtoAddress } from './mailto'

describe('mailtoAddress', () => {
  it('extracts the address', () => {
    expect(mailtoAddress('mailto:hello@margotdauban.fr')).toBe('hello@margotdauban.fr')
    expect(mailtoAddress('MAILTO:a%40b.fr?subject=Projet')).toBe('a@b.fr')
  })
  it('keeps a malformed escape instead of throwing', () => {
    expect(mailtoAddress('mailto:100%@x.fr')).toBe('100%@x.fr')
  })
  it('ignores other links', () => {
    expect(mailtoAddress('https://malt.fr')).toBeNull()
    expect(mailtoAddress('mailto:')).toBeNull()
    expect(mailtoAddress(null)).toBeNull()
  })
})
