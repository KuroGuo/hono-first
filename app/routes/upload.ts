import { Hono } from 'hono'
import { handleFileUpload } from '../helpers/handle-file-upload.js'

const hono = new Hono()

hono.post(async c => {
  const result = await handleFileUpload(c, 'file')

  return c.json({
    message: '文件上传成功',
    fileInfo: {
      originalName: result.originalName,
      savedName: result.savedName,
      size: result.size,
      type: result.type,
      path: result.path
    }
  })
})

export default hono