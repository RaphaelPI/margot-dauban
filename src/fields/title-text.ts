import {
  BoldFeature,
  FixedToolbarFeature,
  lexicalEditor,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical'
import type { FieldHook } from 'payload'

// Titles and quotes where bold text is shown highlighted on the site (lilac background,
// designer's rule): a one-button editor, bold only.
export const titleEditor = lexicalEditor({
  features: () => [ParagraphFeature(), BoldFeature(), FixedToolbarFeature()],
})

const text = (value: string, bold = false) => ({
  type: 'text',
  text: value,
  format: bold ? 1 : 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

// Rich text title from the former « title + highlighted end » pair: the end becomes bold.
export const titleFrom = (title: string, highlight?: string | null) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
        children: [
          ...(title ? [text(highlight ? `${title} ` : title)] : []),
          ...(highlight ? [text(highlight, true)] : []),
        ],
      },
    ],
  },
})

// Spread into a field that used to be plain text next to a separate highlight field:
// `{ name: 'title', label, ...titleText('highlight') }`. A stored string (older content) is shown
// and saved back as rich text, with the sibling highlight in bold; that field is then hidden.
export const titleText = (highlightField?: string) => {
  const fromPlain: FieldHook = ({ value, siblingData }) =>
    typeof value === 'string'
      ? titleFrom(value, highlightField ? (siblingData?.[highlightField] as string | undefined) : undefined)
      : value
  return {
    type: 'richText' as const,
    editor: titleEditor,
    hooks: { afterRead: [fromPlain] },
  }
}

// The former highlight field: kept (its value feeds the hook above), hidden in the admin.
export const legacyHighlight = { type: 'text' as const, admin: { hidden: true } }
