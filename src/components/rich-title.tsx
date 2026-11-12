import { Fragment } from 'react'
import { titleParagraphs } from '@/lib/rich-title'

// French typography: a space before « : ; ! ? » » and after « « » never breaks the line, so the
// punctuation stays with its word.
const keepTogether = (text: string) => text.replace(/ ([:;!?»])/g, '\u00a0$1').replace(/« /g, '«\u00a0')

// Inline rendering of a title / quote from the title editor: bold pieces are highlighted
// (lilac #E2E1FF, dark text), paragraphs become line breaks. Goes inside an h1 / h2 / blockquote.
export function RichTitle({
  value,
  highlightClassName = 'rounded-[0.875rem] bg-accent px-3 text-foreground [box-decoration-break:clone]',
}: {
  value: unknown
  highlightClassName?: string
}) {
  return titleParagraphs(value).map((pieces, p) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: static paragraphs of one title
    <Fragment key={p}>
      {p > 0 ? <br /> : null}
      {pieces.map((piece, i) =>
        piece.text === '\n' ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: static pieces of one title
          <br key={i} />
        ) : piece.highlight ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: static pieces of one title
          <span key={i} className={highlightClassName}>
            {keepTogether(piece.text)}
          </span>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: static pieces of one title
          <Fragment key={i}>{keepTogether(piece.text)}</Fragment>
        ),
      )}
    </Fragment>
  ))
}
