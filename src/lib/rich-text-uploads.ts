// Upload values (populated media docs) found anywhere in a Lexical rich text value, so the
// component rendering it can tag them for revalidation.
export function richTextUploads(value: unknown): unknown[] {
  const found: unknown[] = []
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const { type, value: upload, children, root } = node as Record<string, unknown>
    if (type === 'upload' && upload) found.push(upload)
    if (Array.isArray(children)) children.forEach(walk)
    if (root) walk(root)
  }
  walk(value)
  return found
}
