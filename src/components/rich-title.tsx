import { Fragment, type ReactNode } from 'react'
import { titleExcerpt, titleParagraphs } from '@/lib/rich-title'

// French typography: a space before « : ; ! ? » » and after « « » never breaks the line, so the
// punctuation stays with its word.
const keepTogether = (text: string) => text.replace(/ ([:;!?»])/g, '\u00a0$1').replace(/« /g, '«\u00a0')

// Inline rendering of a title / quote from the title editor: bold pieces are highlighted
// (lilac #E2E1FF, dark text), paragraphs become line breaks. Goes inside an h1 / h2 / blockquote.
// `quote` adds French quotation marks around the whole text; `paragraphClassName` shows each
// paragraph as its own block (long quotes) instead of line breaks.
export function RichTitle({
  value,
  highlightClassName = 'rounded-[0.875rem] bg-accent px-3 text-foreground [box-decoration-break:clone]',
  quote = false,
  paragraphClassName,
  maxWords,
  before,
  after,
}: {
  value: unknown
  highlightClassName?: string
  quote?: boolean
  paragraphClassName?: string
  /** Show only the first words, « … » glued to the last one (see `titleExcerpt`). */
  maxWords?: number
  /** Glued to the first / last word (e.g. coloured quotation marks). */
  before?: ReactNode
  after?: ReactNode
}) {
  const all = quote ? withoutOwnQuoteMarks(titleParagraphs(value)) : titleParagraphs(value)
  const paragraphs = maxWords ? titleExcerpt(all, maxWords).paragraphs : all
  return paragraphs.map((pieces, p) => {
    const content = (
      <>
        {quote && p === 0 ? '«\u00a0' : null}
        {p === 0 ? before : null}
        {renderPieces(pieces, highlightClassName)}
        {p === paragraphs.length - 1 ? after : null}
        {quote && p === paragraphs.length - 1 ? '\u00a0»' : null}
      </>
    )
    return paragraphClassName ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: static paragraphs of one title
      <span key={p} className={paragraphClassName}>
        {content}
      </span>
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: static paragraphs of one title
      <Fragment key={p}>
        {p > 0 ? <br /> : null}
        {content}
      </Fragment>
    )
  })
}

function renderPieces(pieces: ReturnType<typeof titleParagraphs>[number], highlightClassName: string) {
  return pieces.map((piece, i) =>
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
  )
}

// Quotation marks typed in the admin are dropped: the quote adds its own.
function withoutOwnQuoteMarks(paragraphs: ReturnType<typeof titleParagraphs>) {
  const copy = paragraphs.map((pieces) => pieces.map((piece) => ({ ...piece })))
  const first = copy[0]?.[0]
  const lastParagraph = copy[copy.length - 1]
  const last = lastParagraph?.[lastParagraph.length - 1]
  if (first) first.text = first.text.replace(/^\s*[«"“]\s*/, '')
  if (last) last.text = last.text.replace(/\s*[»"”]\s*$/, '')
  return copy
}
