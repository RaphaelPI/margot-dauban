import { z } from 'zod'

// Server env, validated once. Payload config and the CLI (`pnpm payload ...`) import it.
const schema = z
  .object({
    DATABASE_URL: z.string().startsWith('mongodb'),
    PAYLOAD_SECRET: z.string().min(32),
    S3_BUCKET: z.string().min(1).optional(),
    S3_REGION: z.string().min(1).optional(),
    S3_ACCESS_KEY_ID: z.string().min(1).optional(),
    S3_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    S3_PREFIX: z.string().min(1).optional(),
    VERCEL: z.string().optional(),
  })
  // Vercel's filesystem is read-only: media must go to S3 there.
  .refine((env) => !env.VERCEL || (env.S3_BUCKET && env.S3_REGION && env.S3_PREFIX), {
    message: 'S3_BUCKET, S3_REGION and S3_PREFIX are required on Vercel',
  })

export type Env = z.infer<typeof schema>

export const parseEnv = (source: Record<string, string | undefined>): Env => schema.parse(source)
