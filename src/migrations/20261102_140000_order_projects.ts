import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

import { orderKey } from '../lib/order-key'

// Projects become manually orderable (#11). Give existing projects an order key that keeps the
// current order (newest year first, then title). Only `up`/`down` here: Payload loads every file
// of this folder as a migration.
export async function up({ payload, session }: MigrateUpArgs): Promise<void> {
  const db = payload.db.connection.db
  if (!db) throw new Error('MongoDB connection not ready')

  const projects = await db
    .collection('projects')
    .find({ _order: { $exists: false } }, { session, projection: { year: 1, title: 1 } })
    .sort({ year: -1, title: 1 })
    .toArray()
  for (const [index, project] of projects.entries()) {
    const _order = orderKey(index)
    await db.collection('projects').updateOne({ _id: project._id }, { $set: { _order } }, { session })
    // Drafts keep the key too, so publishing a draft doesn't drop it.
    await db
      .collection('_projects_versions')
      .updateMany({ parent: project._id }, { $set: { 'version._order': _order } }, { session })
  }
}

export async function down({ payload, session }: MigrateDownArgs): Promise<void> {
  const db = payload.db.connection.db
  if (!db) throw new Error('MongoDB connection not ready')
  await db.collection('projects').updateMany({}, { $unset: { _order: '' } }, { session })
  await db.collection('_projects_versions').updateMany({}, { $unset: { 'version._order': '' } }, { session })
}
