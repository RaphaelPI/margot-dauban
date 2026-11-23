import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { fr } from '@payloadcms/translations/languages/fr'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { collections } from './collections'
import { Users } from './collections/Users'
import { globals } from './globals'
import { parseEnv } from './lib/env'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const env = parseEnv(process.env)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: { supportedLanguages: { fr }, fallbackLanguage: 'fr' },
  collections,
  globals,
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  graphQL: { disable: true },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: mongooseAdapter({ url: env.DATABASE_URL }),
  // Contact form notifications (collections/ContactMessages.ts). Without SMTP, Payload logs them.
  email: env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: env.EMAIL_FROM ?? '',
        defaultFromName: 'Site margotdauban.fr',
        // Checked when an e-mail is sent, not at start-up: a mail server hiccup never blocks the site.
        skipVerify: true,
        transportOptions: {
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: env.SMTP_PORT === 465,
          auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
        },
      })
    : undefined,
  sharp,
  plugins: [
    // Without S3 (local dev), uploads go to ./media. Fields always inserted: same schema
    // and generated types whether S3 is configured or not.
    s3Storage({
      enabled: Boolean(env.S3_BUCKET),
      alwaysInsertFields: true,
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
