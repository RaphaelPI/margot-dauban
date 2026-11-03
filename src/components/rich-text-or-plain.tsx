import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText } from '@payloadcms/richtext-lexical/react'

// Short texts written with the light editor (bold, italic, underline, links, lists).
const short =
  '[&_*+*]:mt-2 [&_a]:underline [&_a]:underline-offset-4 [&_em]:italic [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5'

// Rich text from the light editor, or a plain string (defaults, texts saved before the editor).
export function RichTextOrPlain({
  value,
  className = '',
}: {
  value: SerializedEditorState | string
  className?: string
}) {
  return typeof value === 'string' ? (
    <p className={`${className} ${short}`}>{value}</p>
  ) : (
    <RichText data={value} className={`${className} ${short}`} />
  )
}
