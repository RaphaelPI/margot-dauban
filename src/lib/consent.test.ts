import { beforeEach, describe, expect, it } from 'vitest'
import { consentMaxAge, readConsent, saveConsent } from './consent'

const store = new Map<string, string>()
globalThis.localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: () => null,
  length: 0,
} as Storage

describe('consent', () => {
  beforeEach(() => store.clear())
  it('is unknown until chosen', () => {
    expect(readConsent()).toBeNull()
  })
  it('remembers the choice for 6 months', () => {
    saveConsent('granted', 1000)
    expect(readConsent(1000 + consentMaxAge - 1)).toBe('granted')
    expect(readConsent(1000 + consentMaxAge + 1)).toBeNull()
  })
  it('ignores broken values', () => {
    store.set('cookie-consent', '{nope')
    expect(readConsent()).toBeNull()
    store.set('cookie-consent', JSON.stringify({ value: 'maybe', at: Date.now() }))
    expect(readConsent()).toBeNull()
  })
})
