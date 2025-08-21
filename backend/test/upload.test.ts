import { describe, it, expect, vi, beforeEach } from 'vitest'
import routes from '../app/routes'
// import { saveFile } from '../app/helpers/upload.js'

// vi.mock('../app/helpers/upload.js', () => {
//   return {
//     saveFile: vi.fn().mockResolvedValue({
//       originalName: 'test.jpg',
//       savedName: 'abc123.jpg',
//       size: 1024,
//       type: 'image/jpeg',
//       path: '/uploads/abc123.jpg'
//     })
//   }
// })

describe('Upload Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle file upload successfully', async () => {
    const formData = new FormData()
    const file = new File(['test file content'], 'test.jpg', { type: 'image/jpeg' })
    formData.append('file', file)

    const res = await routes.request('/upload', {
      method: 'POST',
      body: formData
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({
      originalName: 'test.jpg',
      savedName: expect.any(String),
      size: file.size,
      type: 'image/jpeg',
      path: expect.stringMatching(/^\/uploads\/[a-f0-9-]+\.jpg$/)
    })

    // expect(saveFile).toHaveBeenCalledTimes(1)
  })

  it('应该响应 400', async () => {
    const res = await routes.request('/upload', { method: 'POST' })
    expect(res.status).toBe(400)
  })

  it('应该响应 400', async () => {
    const formData = new FormData()
    const res = await routes.request('/upload', {
      method: 'POST',
      body: formData
    })
    expect(res.status).toBe(400)
  })

  it('应该响应 415', async () => {
    const formData = new FormData()
    const file = new File(['test file content'], 'test.mp4', { type: 'video/mp4' })
    formData.append('file', file)

    const res = await routes.request('/upload', {
      method: 'POST',
      body: formData
    })

    expect(res.status).toBe(415)
  })

  it('应该拒绝大于5MB的文件并返回413', async () => {
    const formData = new FormData();

    // 生成一个 6MB 的虚拟文件（超过限制）
    const largeFileContent = Buffer.alloc(6 * 1024 * 1024, 'a')
    const largeFile = new File([largeFileContent], 'test.jpg', { type: 'image/jpeg' })

    formData.append('file', largeFile)

    const res = await routes.request('/upload', {
      method: 'POST',
      body: formData
    })

    expect(res.status).toBe(413)
  })
})