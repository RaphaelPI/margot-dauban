import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { fr } from '@payloadcms/translations/languages/fr'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'
import { Settings } from './globals/Settings'
import { withGlobalRevalidation, withRevalidation } from './lib/cache'
import { parseEnv } from './lib/env'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const env = parseEnv(process.env)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: { supportedLanguages: { fr }, fallbackLanguage: 'fr' },
  collections: [Projects, Pages, Media, Users].map(withRevalidation),
  globals: [Settings].map(withGlobalRevalidation),
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  graphQL: { disable: true },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: mongooseAdapter({ url: env.DATABASE_URL }),
  sharp,
  plugins: [
    // Without S3 (local dev), uploads go to ./media.
    s3Storage({
      enabled: Boolean(env.S3_BUCKET),
      collections: { media: { prefix: env.S3_PREFIX } },
      bucket: env.S3_BUCKET ?? '',
      config: {
        region: env.S3_REGION,
        credentials:
          env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY
            ? { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY }
            : undefined,
      },
    }),
  ],
})
