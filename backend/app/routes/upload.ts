import { Hono } from 'hono'
import { saveFile } from '../helpers/upload.js'

export default new Hono()
  .post(async c => {
    const formData = c.var.formData
    const file = formData?.get('file') as File | null | undefined
    return c.json(await saveFile(file))
  })