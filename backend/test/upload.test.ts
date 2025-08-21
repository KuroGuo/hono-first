import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'
import uploadRoutes from '../app/routes/upload.js'
import * as handleFileUploadModule from '../app/helpers/handle-file-upload.js'

// 模拟文件上传处理函数
vi.mock('../app/helpers/handle-file-upload.js', () => {
  return {
    handleFileUpload: vi.fn().mockResolvedValue({
      originalName: 'test.jpg',
      savedName: 'abc123.jpg',
      size: 1024,
      type: 'image/jpeg',
      path: '/uploads/abc123.jpg'
    })
  }
})

describe('Upload Routes', () => {
  const app = new Hono()
  app.route('/', uploadRoutes)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle file upload successfully', async () => {
    // 创建模拟的 FormData
    const formData = new FormData()
    const file = new File(['test file content'], 'test.jpg', { type: 'image/jpeg' })
    formData.append('file', file)

    // 发送请求
    const res = await app.request('/', {
      method: 'POST',
      body: formData
    })

    // 验证响应
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({
      originalName: 'test.jpg',
      savedName: 'abc123.jpg',
      size: 1024,
      type: 'image/jpeg',
      path: '/uploads/abc123.jpg'
    })

    // 验证 handleFileUpload 被正确调用
    expect(handleFileUploadModule.handleFileUpload).toHaveBeenCalledTimes(1)
  })
})