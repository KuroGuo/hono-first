import { Hono } from 'hono'
import { handleFileUpload } from '../helpers/handle-file-upload.js'

export default new Hono()
  .post(async c => c.json(await handleFileUpload(c, 'file')))