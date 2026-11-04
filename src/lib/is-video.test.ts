import { describe, expect, it } from 'vitest'
import { isVideo } from './is-video'

describe('isVideo', () => {
  it('accepts a populated video', () => {
    expect(isVideo({ id: '1', url: '/v.mp4', mimeType: 'video/mp4', alt: 'x' })).toBe(true)
  })
  it('rejects images, ids and videos without url', () => {
    expect(isVideo({ id: '1', url: '/i.png', mimeType: 'image/png', alt: 'x' })).toBe(false)
    expect(isVideo('1')).toBe(false)
    expect(isVideo(null)).toBe(false)
    expect(isVideo({ id: '1', mimeType: 'video/mp4', alt: 'x' })).toBe(false)
  })
})
