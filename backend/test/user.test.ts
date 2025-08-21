import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import userRoutes from '../app/routes/user.js'

describe('User Routes', () => {
  const app = new Hono()
  app.route('/', userRoutes)

  it('should return hello message for valid name', async () => {
    const res = await app.request('/kuro')
    expect(res.status).toBe(200)
    expect(await res.json()).toStrictEqual({ name: 'kuro' })
  })

  it('should return error for invalid name', async () => {
    const res = await app.request('/john')
    expect(res.status).toBe(400)
  })
})