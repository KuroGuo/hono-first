import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'
import uploadRoutes from '../app/routes/upload.js'
import saveFile from '../app/helpers/save-file.js'

vi.mock('../app/helpers/save-file.js', () => {
  return {
    default: vi.fn().mockResolvedValue({
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
    const formData = new FormData()
    const file = new File(['test file content'], 'test.jpg', { type: 'image/jpeg' })
    formData.append('file', file)

    const res = await app.request('/', {
      method: 'POST',
      body: formData
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({
      originalName: 'test.jpg',
      savedName: 'abc123.jpg',
      size: 1024,
      type: 'image/jpeg',
      path: '/uploads/abc123.jpg'
    })

    expect(saveFile).toHaveBeenCalledTimes(1)
  })
})