import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import app from '../app/index.js'
import logger from '../app/logger.js'

// 模拟 serve 函数和 logger
vi.mock('@hono/node-server', () => ({
  serve: vi.fn().mockImplementation((options, callback) => {
    if (callback) callback({ port: 3000 })
    return { close: vi.fn() }
  })
}))

vi.mock('../app/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should log requests with correct status', async () => {
    // 测试成功请求的日志记录
    const successRes = await app.request('/api/user/kuro')
    expect(successRes.status).toBe(200)
    expect(logger.info).toHaveBeenCalled()

    // 测试失败请求的日志记录
    const failRes = await app.request('/api/user/invalid')
    expect(failRes.status).toBe(400)
    expect(logger.warn).toHaveBeenCalled()
  })

  it('should handle errors correctly', async () => {
    const res = await app.request('/test-error')
    expect(res.status).toBe(500)
    expect(logger.error).toHaveBeenCalled()

    const json = await res.json()
    expect(json).toHaveProperty('error', 'Test error')
  })
})