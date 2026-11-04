import { describe, expect, it } from 'vitest'
import { richTextUploads } from './rich-text-uploads'

describe('richTextUploads', () => {
  it('finds uploads at any depth', () => {
    const doc = { id: 'm1', url: '/a.png' }
    const value = {
      root: {
        type: 'root',
        children: [
          { type: 'paragraph', children: [{ type: 'text', text: 'Intro' }] },
          { type: 'upload', value: doc },
          { type: 'list', children: [{ type: 'listitem', children: [{ type: 'upload', value: 'm2' }] }] },
        ],
      },
    }
    expect(richTextUploads(value)).toEqual([doc, 'm2'])
  })
  it('handles empty values', () => {
    expect(richTextUploads(null)).toEqual([])
  })
})
