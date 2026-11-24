import fs from 'node:fs/promises'
import path from 'node:path'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

// Media gets pre-generated WebP widths (`upload.imageSizes`). Give the images uploaded before them
// their sizes: read each original back (S3 through the storage handler, or ./media without S3)
// and save it again in place (same filename, same URL) so Payload generates the sizes.
// Only `up`/`down` here: Payload loads every file of this folder as a migration.
const resizable = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/tiff', 'image/avif']

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const upload = payload.collections.media.config.upload
  const { docs } = await payload.find({
    collection: 'media',
    where: { mimeType: { in: resizable } },
    pagination: false,
    depth: 0,
    req,
  })
  for (const doc of docs) {
    if (!doc.filename || doc.sizes?.xs?.filename !== undefined) continue
    const data = await readOriginal(
      doc.filename,
      doc as unknown as { id: string; prefix?: string },
      upload,
      req,
    )
    if (!data) {
      payload.logger.warn(`media ${doc.id}: original ${doc.filename} not found, sizes skipped`)
      continue
    }
    await payload.update({
      collection: 'media',
      id: doc.id,
      data: {},
      file: { data, name: doc.filename, mimetype: doc.mimeType ?? '', size: data.length },
      overwriteExistingFiles: true,
      context: { disableRevalidate: true },
      req,
    })
  }
}

type Upload = MigrateUpArgs['payload']['collections']['media']['config']['upload']

async function readOriginal(
  filename: string,
  doc: { id: string; prefix?: string },
  upload: Upload,
  req: MigrateUpArgs['req'],
): Promise<Buffer | null> {
  for (const handler of upload.handlers ?? []) {
    const res = await handler(req, { doc, params: { collection: 'media', filename, prefix: doc.prefix } })
    if (res instanceof Response) return res.ok ? Buffer.from(await res.arrayBuffer()) : null
  }
  return fs.readFile(path.resolve(upload.staticDir || 'media', filename)).catch(() => null)
}

// Nothing to undo: the sizes are optional fields, ignored if the config loses them.
export async function down(_args: MigrateDownArgs): Promise<void> {}
