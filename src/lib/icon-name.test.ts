import { describe, expect, it } from 'vitest'
import { iconComponentName } from './icon-name'

describe('iconComponentName', () => {
  it('accepts the forms copied from phosphoricons.com', () => {
    expect(iconComponentName('target')).toBe('Target')
    expect(iconComponentName('arrow-up-right')).toBe('ArrowUpRight')
    expect(iconComponentName('Arrow up right')).toBe('ArrowUpRight')
    expect(iconComponentName('ArrowUpRight')).toBe('ArrowUpRight')
    expect(iconComponentName('<ArrowUpRight />')).toBe('ArrowUpRight')
  })
  it('rejects empty or unsafe input', () => {
    expect(iconComponentName('')).toBeNull()
    expect(iconComponentName(null)).toBeNull()
    expect(iconComponentName('<svg onload="x">')).toBeNull()
    expect(iconComponentName('constructor.prototype')).toBeNull()
  })
})
