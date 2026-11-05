import { describe, expect, it } from 'vitest'
import { titleFrom } from '@/fields/title-text'
import { titleParagraphs, titlePlain } from './rich-title'

describe('rich titles', () => {
  it('turns the former title + highlight into a bold end', () => {
    expect(titleParagraphs(titleFrom('Webdesigner UI / UX freelance', 'à Toulouse'))).toEqual([
      [
        { text: 'Webdesigner UI / UX freelance ', highlight: false },
        { text: 'à Toulouse', highlight: true },
      ],
    ])
  })
  it('reads plain strings and empty values', () => {
    expect(titlePlain('Bonjour')).toBe('Bonjour')
    expect(titlePlain(undefined)).toBe('')
    expect(titlePlain(titleFrom('', null))).toBe('')
  })
  it('gives the plain text of every paragraph', () => {
    expect(titlePlain(titleFrom('Parlons de votre', 'projet web'))).toBe('Parlons de votre projet web')
  })
})
