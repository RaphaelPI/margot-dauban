import {
  BlocksFeature,
  BoldFeature,
  FixedToolbarFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import type { FieldHook } from 'payload'
import { AnimationBlock } from './animation-block'

// Light editor for short texts: bold, italic, underline, links and lists, with a visible toolbar.
export const lightEditor = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    LinkFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    FixedToolbarFeature(),
  ],
})

const paragraph = (text: string) => ({
  type: 'paragraph',
  format: '' as const,
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  textFormat: 0,
  children: text ? [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] : [],
})

// Long texts that alternate paragraphs and images: the default features (headings, lists,
// links, images from Médias…) with a visible toolbar, so « insert an image » is easy to find.
export const articleEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
})

// A case study step's detailed text: the article editor plus coded animations (block « Animation »).
export const stepEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    BlocksFeature({ blocks: [AnimationBlock] }),
    FixedToolbarFeature(),
  ],
})

// Rich text value from plain text, one paragraph per line (field defaults, older plain values).
export const richTextFrom = (text: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: text
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map(paragraph),
  },
})

// These fields were plain text at first: a stored string is shown (and saved back) as rich text,
// instead of the editor refusing it.
const plainToRichText: FieldHook = ({ value }) => (typeof value === 'string' ? richTextFrom(value) : value)

// Spread into a field: `{ name, label, ...lightText }`.
export const lightText = {
  type: 'richText' as const,
  editor: lightEditor,
  hooks: { afterRead: [plainToRichText] },
}
