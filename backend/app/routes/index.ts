import { Hono } from 'hono'
import user from './user.js'
import upload from './upload.js'
import bodyParser from '../middlewares/body-parser.js'

const app = new Hono()
  .route('/user', user)
  .route('/upload', upload)

export default new Hono()
  .use(bodyParser())
  .route('/', app)