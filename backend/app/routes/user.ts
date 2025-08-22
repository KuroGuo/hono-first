import { Hono } from 'hono'
import { HTTPError } from '../middlewares/translate.js'

export default new Hono()
  .get('/:name', c => {
    const name = c.req.param('name')

    const t = c.var.translator()

    if (name !== 'kuro') {
      throw new HTTPError(400, { message: t('name 必须为 kuro') })
    }

    return c.json({ name }, 200)
  })