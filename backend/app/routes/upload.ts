import { Hono } from 'hono'
import { saveFile } from '../helpers/upload.js'
import { validator } from 'hono/validator'
import { HTTPException } from 'hono/http-exception'

export default new Hono()
  .post('/', validator('form', form => {
    const file = form['file']
    if (!(file instanceof File)) {
      throw new HTTPException(400, { message: 'file 字段验证失败' })
    }
    return { file }
  }), async c => {
    const { file } = c.req.valid('form')
    return c.json(await saveFile(file))
  })