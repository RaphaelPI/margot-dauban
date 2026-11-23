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

  it('keeps e-mail optional, but complete when set', () => {
    expect(parseEnv(base).SMTP_HOST).toBeUndefined()
    expect(() => parseEnv({ ...base, SMTP_HOST: 'mail.example.fr' })).toThrow(/SMTP_USER/)
    const smtp = { SMTP_HOST: 'mail.example.fr', SMTP_USER: 'hello@example.fr', SMTP_PASS: 'p' }
    expect(parseEnv({ ...base, ...smtp, EMAIL_FROM: 'hello@example.fr' }).SMTP_PORT).toBe(465)
    expect(() => parseEnv({ ...base, ...smtp, EMAIL_FROM: 'pas-un-email' })).toThrow()
  })
})
