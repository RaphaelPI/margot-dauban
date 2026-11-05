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
