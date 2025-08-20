import { describe, it, expect, vi } from 'vitest'
import { Hono } from 'hono'
import bodyParser from '../app/middlewares/body-parser.js'
import { authenticateToken } from '../app/middlewares/auth.js'
import * as viem from 'viem'

// 模拟 viem 库
vi.mock('viem', () => {
  return {
    recoverMessageAddress: vi.fn()
  }
})

describe('Middlewares', () => {
  describe('bodyParser', () => {
    it('should parse JSON body', async () => {
      const app = new Hono()
      app.use(bodyParser())
      app.post('/', c => {
        const json: any = c.get('json')
        return c.json(json)
      })

      const res = await app.request('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: 'data' })
      })

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json).toEqual({ test: 'data' })
    })

    it('should parse form data', async () => {
      const app = new Hono()
      app.use(bodyParser())
      app.post('/', async c => {
        const formData = c.get('formData')
        const value = formData?.get('test')
        return c.json({ value })
      })

      const formData = new FormData()
      formData.append('test', 'data')

      const res = await app.request('/', {
        method: 'POST',
        body: formData
      })

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json).toEqual({ value: 'data' })
    })
  })

  describe('authenticateToken', () => {
    it('should return 403 when token is missing', async () => {
      const app = new Hono()
      app.use(authenticateToken())
      app.get('/', c => c.text('OK'))

      const res = await app.request('/')
      expect(res.status).toBe(403)
      const json = await res.json()
      expect(json).toEqual({ code: 403, data: 'MISSING_TOKEN' })
    })

    it('should proceed when token is valid', async () => {
      // 模拟 recoverMessageAddress 返回地址
      vi.mocked(viem.recoverMessageAddress).mockResolvedValue('0x123456789abcdef')

      const app = new Hono()
      app.use(authenticateToken())
      app.get('/', c => {
        const user = c.get('user')
        return c.json({ user })
      })

      const token = JSON.stringify({
        message: 'test message',
        sign: '0xabcdef1234567890'
      })

      const res = await app.request('/', {
        headers: {
          token
        }
      })

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json).toEqual({ user: { account: '0x123456789abcdef' } })
      expect(viem.recoverMessageAddress).toHaveBeenCalledWith({
        message: 'test message',
        signature: '0xabcdef1234567890'
      })
    })

    it('should allow skipping auth when isOptional is true', async () => {
      const app = new Hono()
      app.use(authenticateToken(true))
      app.get('/', c => c.text('OK'))

      const res = await app.request('/')
      expect(res.status).toBe(200)
      expect(await res.text()).toBe('OK')
    })
  })
})