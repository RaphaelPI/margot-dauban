import {
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

// A one-paragraph rich text value, for field defaults.
export const richTextFrom = (text: string) => ({
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
        children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
      },
    ],
  },
})
