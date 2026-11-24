// Pieces of a title / quote written in the title editor: one list per paragraph, each piece
// flagged when bold (shown highlighted). Accepts older plain strings too.
export type TitlePiece = { text: string; highlight: boolean }

type Node = { type?: string; text?: string; format?: number; children?: Node[] }

export function titleParagraphs(value: unknown): TitlePiece[][] {
  if (typeof value === 'string') return value ? [[{ text: value, highlight: false }]] : []
  const root = (value as { root?: Node } | null | undefined)?.root
  const paragraphs = root?.children ?? []
  return paragraphs
    .map((paragraph) => {
      const pieces: TitlePiece[] = []
      const walk = (node: Node) => {
        if (node.type === 'text' && node.text)
          pieces.push({ text: node.text, highlight: Boolean((node.format ?? 0) & 1) })
        else if (node.type === 'linebreak') pieces.push({ text: '\n', highlight: false })
        node.children?.forEach(walk)
      }
      walk(paragraph)
      return pieces
    })
    .filter((pieces) => pieces.some((piece) => piece.text.trim()))
}

// Plain text of a title (metadata, emptiness checks).
export const titlePlain = (value: unknown) =>
  titleParagraphs(value)
    .map((pieces) => pieces.map((piece) => piece.text).join(''))
    .join(' ')
    .trim()

// The first `maxWords` words of a title / quote, paragraphs and highlights kept; « … » is glued to
// the last kept word. `cut`: some text was left out.
export function titleExcerpt(paragraphs: TitlePiece[][], maxWords: number) {
  let left = maxWords
  const kept: TitlePiece[][] = []
  for (const pieces of paragraphs) {
    if (left <= 0) return { paragraphs: kept, cut: true }
    const keptPieces: TitlePiece[] = []
    for (const piece of pieces) {
      const words = piece.text.split(/(\s+)/)
      let text = ''
      for (const part of words) {
        if (!part.trim()) {
          text += part
          continue
        }
        if (left <= 0) break
        text += part
        left--
      }
      if (text.trim() || keptPieces.length) keptPieces.push({ ...piece, text })
      if (left <= 0) break
    }
    kept.push(keptPieces)
  }
  const remaining = paragraphs
    .flat()
    .map((piece) => piece.text)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length
  const cut = remaining > maxWords
  if (cut) {
    const last = kept.at(-1)?.at(-1)
    if (last) last.text = `${last.text.trimEnd().replace(/[\s,;:.!?…]+$/, '')}…`
  }
  return { paragraphs: kept, cut }
}
