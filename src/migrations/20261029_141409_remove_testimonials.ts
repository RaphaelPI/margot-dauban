import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

// Testimonials are removed from the content model (#1): drop their documents and the
// home global's reference to them. Not reversible: the data is gone.
export async function up({ payload, session }: MigrateUpArgs): Promise<void> {
  const db = payload.db.connection.db
  if (!db) throw new Error('MongoDB connection not ready')

  // deleteMany, not dropCollection: DDL isn't allowed inside the migration's transaction.
  await db.collection('testimonials').deleteMany({}, { session })
  await db
    .collection('globals')
    .updateMany({ globalType: 'home' }, { $unset: { testimonial: '' } }, { session })
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Deleted testimonials cannot be restored.
}
