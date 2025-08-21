import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

export default new Hono()
  .get('/:name', c => {
    const name = c.req.param('name')

    if (name !== 'kuro') {
      throw new HTTPException(400, { message: 'name 必须为 kuro' })
    }

    return c.json({ name }, 200)
  })