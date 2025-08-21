import { Hono } from 'hono'

export default new Hono()
  .get('/:name', c => {
    const name = c.req.param('name')

    if (name !== 'kuro') {
      return c.json({ error: 'name 必须为 kuro' }, 400)
    }

    return c.json({ name }, 200)
  })