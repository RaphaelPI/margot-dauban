import { beforeEach, describe, expect, it, vi } from 'vitest'

const create = vi.fn()
vi.mock('@/lib/payload', () => ({ getPayload: async () => ({ create }) }))

const { sendContact } = await import('./actions')

const form = (fields: Record<string, string>) => {
  const data = new FormData()
  for (const [key, value] of Object.entries(fields)) data.set(key, value)
  return data
}
const valid = { name: 'Camille', email: 'camille@entreprise.fr', phone: '', message: 'Un projet' }

describe('sendContact', () => {
  beforeEach(() => create.mockReset())

  it('stores a valid message', async () => {
    expect(await sendContact({ status: 'idle' }, form(valid))).toEqual({ status: 'sent' })
    expect(create).toHaveBeenCalledWith({
      collection: 'contact-messages',
      data: { ...valid, handled: false },
    })
  })

  it('rejects an invalid e-mail and an empty message, keeping the values', async () => {
    const state = await sendContact({ status: 'idle' }, form({ ...valid, email: 'camille@', message: '  ' }))
    expect(state.status).toBe('error')
    expect(Object.keys(state.errors ?? {}).sort()).toEqual(['email', 'message'])
    expect(state.values?.name).toBe('Camille')
    expect(create).not.toHaveBeenCalled()
  })

  it('thanks bots filling the hidden field without storing anything', async () => {
    expect(await sendContact({ status: 'idle' }, form({ ...valid, website: 'spam.example' }))).toEqual({
      status: 'sent',
    })
    expect(create).not.toHaveBeenCalled()
  })

  it('reports a save failure', async () => {
    create.mockRejectedValueOnce(new Error('db down'))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const state = await sendContact({ status: 'idle' }, form(valid))
    expect(state.status).toBe('error')
    expect(state.errors?.form).toBeTruthy()
  })
})
