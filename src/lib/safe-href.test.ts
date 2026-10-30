import { describe, expect, it } from 'vitest'
import { isSafeHref, validateHref } from './safe-href'

describe('isSafeHref', () => {
  it('accepts site paths, anchors, web and mail links', () => {
    for (const href of ['/contact', '#detail', 'https://lebikini.com', 'http://x.fr', 'mailto:a@b.fr']) {
      expect(isSafeHref(href)).toBe(true)
    }
  })
  it('rejects scripts and protocol-relative links', () => {
    for (const href of ['javascript:alert(1)', ' JavaScript:alert(1)', 'data:text/html,x', '//evil.com']) {
      expect(isSafeHref(href)).toBe(false)
    }
  })
  it('lets an empty optional field through', () => {
    expect(validateHref('')).toBe(true)
    expect(validateHref('javascript:x')).toBeTypeOf('string')
  })
})
