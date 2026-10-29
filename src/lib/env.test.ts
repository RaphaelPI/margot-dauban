import { describe, expect, it } from 'vitest'
import { parseEnv } from './env'

const base = { DATABASE_URL: 'mongodb://localhost/test', PAYLOAD_SECRET: 'x'.repeat(32) }

describe('parseEnv', () => {
  it('accepts a local env without S3', () => {
    expect(parseEnv(base).S3_BUCKET).toBeUndefined()
  })

  it('rejects a non-Mongo database URL', () => {
    expect(() => parseEnv({ ...base, DATABASE_URL: 'postgres://x' })).toThrow()
  })

  it('requires S3 on Vercel', () => {
    expect(() => parseEnv({ ...base, VERCEL: '1' })).toThrow(/S3_BUCKET/)
    expect(() =>
      parseEnv({ ...base, VERCEL: '1', S3_BUCKET: 'b', S3_REGION: 'eu-west-3', S3_PREFIX: 'prod' }),
    ).not.toThrow()
  })
})
