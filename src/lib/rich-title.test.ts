import { describe, expect, it } from 'vitest'
import { titleFrom } from '@/fields/title-text'
import { titleExcerpt, titleParagraphs, titlePlain } from './rich-title'

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

  it('cuts a quote after n words, the ellipsis glued to the last word', () => {
    const text = (words: number) => Array.from({ length: words }, (_, i) => `mot${i + 1}`).join(' ')
    const long = [
      [
        { text: `${text(3)} et sa`, highlight: false },
        { text: ' disponibilité, ici', highlight: true },
      ],
    ]
    const { paragraphs, cut } = titleExcerpt(long, 5)
    expect(cut).toBe(true)
    expect(
      paragraphs
        .flat()
        .map((piece) => piece.text)
        .join(''),
    ).toBe('mot1 mot2 mot3 et sa…')
    expect(titleExcerpt([[{ text: text(4), highlight: false }]], 5).cut).toBe(false)
    const two = titleExcerpt([[{ text: text(3), highlight: false }], [{ text: text(4), highlight: true }]], 5)
    expect(two.paragraphs.map((p) => p.map((piece) => piece.text).join(''))).toEqual([
      'mot1 mot2 mot3',
      'mot1 mot2,'.replace(',', '…'),
    ])
  })
})
