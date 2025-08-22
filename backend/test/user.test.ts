import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import api from '../app/routes'

describe('User Routes', () => {
  const app = new Hono()
  app.route('/api', api)

  it('should return hello message for valid name', async () => {
    const res = await app.request('/api/user/kuro')
    expect(res.status).toBe(200)
    expect(await res.json()).toStrictEqual({ name: 'kuro' })
  })

  it('should return error for invalid name', async () => {
    const res = await app.request('/api/user/john')
    expect(res.status).toBe(400)
  })
})