import { describe, expect, it } from 'vitest'
import { isActive } from './nav-links'

describe('isActive', () => {
  it('matches the home page exactly', () => {
    expect(isActive('/', '/')).toBe(true)
    expect(isActive('/', '/projets')).toBe(false)
  })
  it('matches a section and its sub-pages', () => {
    expect(isActive('/projets', '/projets/le-bikini')).toBe(true)
    expect(isActive('/projets', '/projets-archives')).toBe(false)
    expect(isActive('/expertises#methode', '/expertises')).toBe(true)
  })
  it('ignores external links and anchors only', () => {
    expect(isActive('https://malt.fr', '/')).toBe(false)
  })
})
