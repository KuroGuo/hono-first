import { Hono } from 'hono'
import { HTTPError, text } from '../translate.js'

export default new Hono()
  .get('/:name', c => {
    const name = c.req.param('name')

    if (name !== 'kuro') {
      throw new HTTPError(400, { text: text('name 必须为 kuro') })
    }

    return c.json({ name }, 200)
  })