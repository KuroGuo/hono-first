import { Hono } from 'hono'
import { handleFileUpload } from '../helpers/handle-file-upload.js'

export default new Hono()
  .post(async c => {
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